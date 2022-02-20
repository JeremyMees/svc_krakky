import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { CredentialsModel } from '../models/credentials.model';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { UserModel } from 'src/users/models/user.model';

@Injectable()
export class AuthService {
  salt: number = Number(this.configService.get('SALT_ROUNDS'));
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name)
    private users: Model<UserDocument>,
  ) {}

  async validateUser(credentials: CredentialsModel): Promise<HttpResponse> {
    return this.getUser(credentials.email, true)
      .then((response: HttpResponse) => {
        if (response.statusCode === 200) {
          return bcrypt
            .compare(credentials.password, response.data.password)
            .then(async (res: boolean) => {
              if (res) {
                const nowPlusWeek: number = (Date.now() + 604800000) as number;
                return {
                  statusCode: 200,
                  message: `User logged in successfully`,
                  data: {
                    token_expire_time: nowPlusWeek,
                    access_token: this.jwtService.sign({
                      id: response.data._id,
                      token_expire_time: nowPlusWeek,
                    }),
                  },
                };
              } else {
                return {
                  statusCode: 400,
                  message: `Error password or email is incorrect`,
                };
              }
            })
            .catch(() => {
              return {
                statusCode: 400,
                message: `Error while comparing passwords`,
              };
            });
        } else {
          return {
            statusCode: 400,
            message: `Couldn't find user`,
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error trying to fetch user`,
        };
      });
  }

  async getToken(credentials: CredentialsModel): Promise<HttpResponse> {
    return this.getUser(credentials.email, true)
      .then((response: HttpResponse) => {
        if (response.data) {
          return bcrypt
            .compare(credentials.password, response.data.password)
            .then((res: boolean) => {
              if (res) {
                const nowPlusWeek: number = (Date.now() + 604800000) as number;
                return {
                  statusCode: 200,
                  message: `User logged in successfully`,
                  data: {
                    token_expire_time: nowPlusWeek,
                    access_token: this.jwtService.sign({
                      id: response.data._id,
                      token_expire_time: nowPlusWeek,
                    }),
                  },
                };
              } else {
                return {
                  statusCode: 400,
                  message: `Error password or email is incorrect`,
                };
              }
            })
            .catch(() => {
              return {
                statusCode: 400,
                message: `Error while comparing passwords `,
              };
            });
        } else {
          return {
            statusCode: 400,
            message: `Couldn't find user`,
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error trying to fetch user`,
        };
      });
  }

  async getUser(id: string, password: boolean): Promise<HttpResponse> {
    const regex: RegExp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    if (id) {
      const query = regex.test(id) ? { email: id } : { _id: id };
      return this.users
        .findOne(query)
        .exec()
        .then((user: UserModel) => {
          if (user) {
            const data = JSON.parse(JSON.stringify(user));
            password ? undefined : delete data.password;
            return {
              statusCode: 200,
              message: `Fetched user successfully`,
              data: data,
            };
          } else {
            return {
              statusCode: 404,
              message: `Couldn't find user`,
            };
          }
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: `Error when fetching user`,
          };
        });
    } else {
      return {
        statusCode: 400,
        message: `No id was provided`,
      };
    }
  }
}
