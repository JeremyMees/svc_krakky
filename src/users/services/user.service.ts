import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
import { MemberModel } from 'src/workspace/models/member.model';
import { UpdateUserImgDTO } from '../dtos/update-user-img.dto';
import { AssigneeModel } from 'src/card/models/assignee.model';
import { UpdateUserSettingsDTO } from '../dtos/update-settings.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { MongoExclude } from 'src/shared/models/mongo-exclude.model';

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
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
  ) {}

  async getUser(
    queryparams: QueryparamsUser,
    exclude?: MongoExclude,
  ): Promise<HttpResponse> {
    const params = await this.queryBuilder(queryparams);
    if (Object.entries(params).length > 0) {
      return this.users
        .findOne(params, exclude)
        .exec()
        .then((user: UserModel) => {
          if (user) {
            return {
              statusCode: 200,
              message: `Fetched user successfully`,
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
    const emailUsed = await this.checkEmailIsUsed({
      email: user.email,
    });
    if (emailUsed.data) {
      return emailUsed;
    } else {
      const hash: string = await bcrypt.hash(user.password, this.salt);
      user.password = hash;
      user.verified = false;
      const newUser = new this.users(user);
      return newUser
        .save()
        .then((user: UserModel) => {
          this.mailService.sendWelcomeMail({
            username: user.username,
            email: user.email,
            id: user._id,
          });
          return {
            statusCode: 201,
            message: `Created user ${user._id} successfully`,
            data: {
              username: user.username,
              email: user.email,
              _id: user._id,
              verified: user.verified,
              img: user.img,
              img_query: user.img_query,
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

  async patchUser(user_to_update: UpdateUserDTO): Promise<HttpResponse> {
    return this.users
      .findOne({ _id: user_to_update._id })
      .then(async (user: UserModel) => {
        if (user) {
          return bcrypt
            .compare(user_to_update.password, user.password)
            .then(async (res: boolean) => {
              if (res) {
                const updated_user = user_to_update;
                if (updated_user.new_password) {
                  updated_user.password = await bcrypt.hash(
                    updated_user.new_password,
                    this.salt,
                  );
                  delete updated_user.new_password;
                } else {
                  delete updated_user.password;
                }
                return await this.users
                  .updateOne({ _id: updated_user._id }, updated_user)
                  .exec()
                  .then(() => {
                    return {
                      statusCode: 200,
                      message: `Updated user ${updated_user._id} successfully`,
                      data: {
                        username: updated_user.username
                          ? updated_user.username
                          : user.username,
                        email: updated_user.email
                          ? updated_user.email
                          : user.email,
                        _id: updated_user._id,
                        verified: updated_user.verified
                          ? updated_user.verified
                          : user.verified,
                        marketing: updated_user.marketing
                          ? updated_user.marketing
                          : user.marketing,
                      },
                    };
                  })
                  .catch(() => {
                    return {
                      statusCode: 400,
                      message: `Error while trying to update user ${updated_user._id}`,
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

  async updateUserSettings(data: UpdateUserSettingsDTO): Promise<HttpResponse> {
    return this.users
      .findOne({ _id: data._id })
      .then(async (user: UserModel) => {
        if (user) {
          if ('marketing' in data) {
            return await this.users
              .updateOne({ _id: data._id }, { marketing: data.marketing })
              .exec()
              .then(() => {
                const updated_user = JSON.parse(JSON.stringify(user));
                updated_user.marketing = data.marketing;
                delete updated_user.password;
                return {
                  statusCode: 200,
                  message: `Updated user ${updated_user._id} successfully`,
                  data: updated_user,
                };
              })
              .catch(() => {
                return {
                  statusCode: 400,
                  message: `Error while trying to update user ${user._id}`,
                };
              });
          } else {
            return { statusCode: 400, message: `No settinngs received` };
          }
        } else {
          return { statusCode: 400, message: `Error couldn't find user` };
        }
      })
      .catch(() => {
        return { statusCode: 400, message: `Error while trying to query user` };
      });
  }

  async patchUserImage(user: UpdateUserImgDTO): Promise<HttpResponse> {
    return await this.users
      .updateOne(
        { _id: user._id },
        { img: user.img, img_query: user.img_query },
      )
      .exec()
      .then(() => {
        return {
          statusCode: 200,
          message: `Updated user ${user._id} successfully`,
          data: {
            _id: user._id,
            img: user.img,
            img_query: user.img_query,
          },
        };
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error while trying to update user ${user._id}`,
        };
      });
  }

  async deleteUser(params: { _id: string }): Promise<HttpResponse> {
    const user: HttpResponse = await this.getUser({ id: params._id });
    return this.users
      .deleteOne(params)
      .exec()
      .then((res) => {
        if (res.deletedCount > 0) {
          if (user.statusCode === 200) {
            this.mailService.sendGoodbyeMail({
              username: user.data.username,
              email: user.data.email,
            });
          }
          return {
            statusCode: 200,
            message: `Deleted user successfully`,
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
  }

  async verifyUser(param: { id: string }): Promise<HttpResponse> {
    return await this.users
      .updateOne({ _id: param.id }, { verified: true })
      .exec()
      .then(() => {
        return {
          statusCode: 200,
          message: `Verified user ${param.id} successfully`,
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

  async checkEmailIsUsed(obj: { email: string }): Promise<HttpResponse> {
    return this.users
      .findOne({ email: obj.email })
      .exec()
      .then((user: UserModel) => {
        if (user) {
          return {
            statusCode: 400,
            message: `Error email is alreasy in use`,
            data: true,
          };
        } else {
          return {
            statusCode: 200,
            message: `Email is unique`,
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
          const currentDatePlusTwelveHoures = Date.now() + 43200000;
          const newReset = new this.reset_password({
            user_id: user.data._id,
            token: hash,
            expire: currentDatePlusTwelveHoures,
          });
          return newReset
            .save()
            .then((resetObj: ResetPasswordTokenModel) => {
              return {
                statusCode: 201,
                message: `Created reset password successfully`,
                data: {
                  user_id: resetObj.user_id,
                  token: resetObj.token,
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
            resetObj.token === response.token
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

  async getMembers(body: Array<MemberModel>): Promise<HttpResponse> {
    let teamMembers: Array<AssigneeModel> = [];
    await this.asyncForEach(body, async (member: MemberModel) => {
      await this.getUser({ id: member._id }).then((res: HttpResponse) => {
        if (res.statusCode === 200) {
          teamMembers.push({
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email,
            img: res.data.img,
            img_query: res.data.img_query,
          });
        } else {
          return res;
        }
      });
    });
    return {
      statusCode: 200,
      message: `Members fetched successfullly`,
      data: teamMembers,
    };
  }

  async asyncForEach(array: any, callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
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
