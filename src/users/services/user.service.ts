import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UserModel } from '../models/user.model';
import { MONGO_KEYS } from '../../shared/data/mongo-keys';
import { QueryBuilder } from '../../shared/models/querybuilder.model';
import { QueryparamsUser } from '../models/queryparams.model';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { HttpResponse } from 'src/shared/models/http-response.model';

@Injectable()
export class UserService {
  mongoKeys = MONGO_KEYS;
  salt: number = Number(this.configService.get('SALT_ROUNDS'));

  constructor(
    @InjectModel(User.name)
    private users: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async getUser(queryparams: QueryparamsUser): Promise<HttpResponse> {
    const params = await this.queryBuilder(queryparams);
    if (Object.entries(params).length > 0) {
      return this.users
        .findOne(params)
        .exec()
        .then((user: UserModel) => {
          if (user) {
            return {
              statusCode: 200,
              message: `Fetched user succesfully`,
              data: user,
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
        message: `Error query params weren't provided`,
      };
    }
  }

  async addUser(user: UserModel): Promise<HttpResponse> {
    const hash: string = await bcrypt.hash(user.password, this.salt);
    user.password = hash;
    const newUser = new this.users(user);
    return newUser
      .save()
      .then((user: UserModel) => {
        return {
          statusCode: 201,
          message: `Created user ${user._id} succesfully`,
          data: user,
        };
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error when adding new user`,
        };
      });
  }

  async patchUser(data: {
    user: UserModel;
    updatedUser: UserModel;
  }): Promise<HttpResponse> {
    return this.users
      .findOne({ email: data.user.email })
      .then(async (user: UserModel) => {
        if (user) {
          const hash: string = await bcrypt.hash(data.user.password, this.salt);
          return bcrypt
            .compare(user.password, hash)
            .then(async (res: boolean) => {
              if (res) {
                return await this.users
                  .updateOne({ email: user.email }, data.updatedUser)
                  .exec()
                  .then(() => {
                    return {
                      statusCode: 200,
                      message: `Updated user ${user._id} succesfully`,
                      data: data.updatedUser,
                    };
                  })
                  .catch(() => {
                    return {
                      statusCode: 400,
                      message: `Error while trying to update user ${user._id}`,
                    };
                  });
              } else {
                return {
                  statusCode: 400,
                  message: `Error while comparing passwords`,
                };
              }
            });
        } else {
          return { statusCode: 400, message: `Error couldn't find user` };
        }
      })
      .catch(() => {
        return { statusCode: 400, message: `Error while trying to query user` };
      });
  }

  async deleteUser(queryparams: QueryparamsUser): Promise<HttpResponse> {
    const params = await this.queryBuilder(queryparams);
    if (Object.entries(params).length > 0) {
      return this.users
        .deleteOne(params)
        .exec()
        .then((res) => {
          if (res.deletedCount > 0) {
            return {
              statusCode: 200,
              message: `Deleted user succesfully`,
            };
          } else {
            return { statusCode: 400, message: `Error couldn't find user` };
          }
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: `Error while trying to delete user`,
          };
        });
    } else {
      return {
        statusCode: 400,
        message: `Error query params weren't provided`,
      };
    }
  }

  async queryBuilder(obj: QueryBuilder) {
    const params = JSON.parse(JSON.stringify(obj));
    if (params === {}) {
      return;
    } else {
      const query = {};
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          query[this.mongoKeys[key]] = params[key];
        }
      }
      return query;
    }
  }
}
