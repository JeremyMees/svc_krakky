import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { CredentialsModel } from '../models/credentials.model';

@Injectable()
export class AuthService {
  salt: number = Number(this.configService.get('SALT_ROUNDS'));
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(credentials: CredentialsModel): Promise<HttpResponse> {
    return this.userService
      .getUser({ email: credentials.email })
      .then((response: HttpResponse) => {
        if (response.statusCode === 200) {
          return bcrypt
            .compare(credentials.password, response.data.password)
            .then(async (res: boolean) => {
              if (res) {
                return {
                  statusCode: 200,
                  message: `Fetched user succesfully`,
                  data: {
                    _id: response.data._id,
                    username: response.data.username,
                    email: response.data.email,
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

  async login(credentials: CredentialsModel): Promise<HttpResponse> {
    return this.userService
      .getUser(credentials)
      .then((response: HttpResponse) => {
        if (response.data) {
          return bcrypt
            .compare(credentials.password, response.data.password)
            .then((res: boolean) => {
              if (res) {
                const data = JSON.parse(JSON.stringify(response.data));
                const nowPlusWeek: number = (Date.now() + 604800000) as number;
                delete data.password;
                data.token_expire_time = nowPlusWeek;
                data.acces_token = this.jwtService.sign(credentials);
                return {
                  statusCode: 200,
                  message: `User logged in successfully`,
                  data: data,
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
}
