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
import { randomBytes } from 'crypto';
import {
  ResetPassword,
  ResetPasswordDocument,
} from '../schemas/reset-password-token.schema';
import { ResetPasswordTokenModel } from '../models/reset-password-token.model';
import { ResetPasswordModel } from '../models/reset-password.model';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  mongoKeys = MONGO_KEYS;
  salt: number = Number(this.configService.get('SALT_ROUNDS'));

  constructor(
    @InjectModel(User.name)
    private users: Model<UserDocument>,
    @InjectModel(ResetPassword.name)
    private reset_password: Model<ResetPasswordDocument>,
    private configService: ConfigService,
    private mailService: MailService,
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
    const usernameUsed = await this.checkUsernameIsUsed({
      username: user.username,
    });
    if (usernameUsed.data) {
      return usernameUsed;
    } else {
      const hash: string = await bcrypt.hash(user.password, this.salt);
      user.password = hash;
      user.verified = false;
      const newUser = new this.users(user);
      return newUser
        .save()
        .then((user: UserModel) => {
          this.mailService.welcome(user.username, user.email, user._id);
          return {
            statusCode: 201,
            message: `Created user ${user._id} succesfully`,
            data: {
              username: user.username,
              email: user.email,
              _id: user._id,
              verified: user.verified,
            },
          };
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: `Error when adding new user`,
          };
        });
    }
  }

  async patchUser(data: {
    user: UserModel;
    updatedUser: UserModel;
  }): Promise<HttpResponse> {
    return this.users
      .findOne({ email: data.user.email })
      .then(async (user: UserModel) => {
        if (user) {
          return bcrypt
            .compare(data.user.password, user.password)
            .then(async (res: boolean) => {
              if (res) {
                return await this.users
                  .updateOne({ email: user.email }, data.updatedUser)
                  .exec()
                  .then(() => {
                    return {
                      statusCode: 200,
                      message: `Updated user ${user._id} succesfully`,
                      data: {
                        username: data.updatedUser.username,
                        email: data.updatedUser.email,
                        _id: data.updatedUser._id,
                        verified: data.updatedUser.verified,
                      },
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

  async verifyUser(param: { id: string }): Promise<HttpResponse> {
    return await this.users
      .updateOne({ _id: param.id }, { verified: true })
      .exec()
      .then(() => {
        return {
          statusCode: 200,
          message: `Verified user ${param.id} succesfully`,
          data: {
            _id: param.id,
            verified: true,
          },
        };
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error while trying to verify user ${param.id}`,
        };
      });
  }

  async checkUsernameIsUsed(obj: { username: string }): Promise<HttpResponse> {
    return this.users
      .findOne({ username: obj.username.trim() })
      .exec()
      .then((user: UserModel) => {
        if (user) {
          return {
            statusCode: 400,
            message: `Error username is alreasy in use`,
            data: true,
          };
        } else {
          return {
            statusCode: 200,
            message: `Username is unique`,
            data: false,
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error while fetching users`,
          data: true,
        };
      });
  }

  async createResetPasswordToken(obj: {
    email: string;
  }): Promise<HttpResponse> {
    const user: HttpResponse = await this.getUser(obj);
    if (user.statusCode === 200) {
      return this.reset_password
        .findOne({ user_id: user.data._id })
        .exec()
        .then(async (response: ResetPasswordTokenModel) => {
          if (response) {
            this.reset_password
              .deleteOne({ user_id: user.data._id })
              .exec()
              .then((res) => {
                if (res.deletedCount === 0) {
                  return {
                    statusCode: 400,
                    message: `Error couldn't find reset object`,
                  };
                }
              });
          }
          const token = randomBytes(32).toString('hex');
          const hash: string = await bcrypt.hash(token, this.salt);
          const currentDatePlusTwelveHoures = new Date().getTime() + 43200000;
          const newReset = new this.reset_password({
            user_id: user.data._id,
            resetPasswordToken: hash,
            expire: currentDatePlusTwelveHoures,
          });
          return newReset
            .save()
            .then((resetObj: ResetPasswordTokenModel) => {
              return {
                statusCode: 201,
                message: `Created reset password succesfully`,
                data: {
                  user_id: resetObj.user_id,
                  resetPasswordToken: resetObj.resetPasswordToken,
                  expire: resetObj.expire,
                },
              };
            })
            .catch(() => {
              return {
                statusCode: 400,
                message: `Error when adding reset token`,
              };
            });
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: `Error while chekking for reset token`,
          };
        });
    } else {
      return user;
    }
  }

  async resetPassword(resetObj: ResetPasswordModel): Promise<HttpResponse> {
    return this.reset_password
      .findOne({ user_id: resetObj.user_id })
      .exec()
      .then(async (response: ResetPasswordTokenModel) => {
        if (response) {
          const expireDate = response.expire;
          const currentDate = new Date();
          if (
            Number(currentDate) < Number(expireDate) &&
            resetObj.token === response.resetPasswordToken
          ) {
            const hash: string = await bcrypt.hash(
              resetObj.password,
              this.salt,
            );
            return this.users
              .updateOne({ _id: resetObj.user_id }, { password: hash })
              .exec()
              .then(async () => {
                return this.reset_password
                  .deleteOne({ user_id: resetObj.user_id })
                  .exec()
                  .then(() => {
                    return {
                      statusCode: 200,
                      message: `Password was reset correctly`,
                    };
                  })
                  .catch(() => {
                    return {
                      statusCode: 400,
                      message: `Error while deleting old token`,
                    };
                  });
              })
              .catch(() => {
                return {
                  statusCode: 400,
                  message: `Error while updating user`,
                };
              });
          } else {
            return {
              statusCode: 404,
              message: 'Error invalid or expired reset token',
            };
          }
        } else {
          return {
            statusCode: 400,
            message: "Error couldn't find reset token",
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error while fetching reset token`,
        };
      });
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
