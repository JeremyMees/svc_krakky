import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workspace, WorkspaceDocument } from '../schemas/workspace.schema';
import {
  WorkspaceToken,
  WorkspaceTokenDocument,
} from '../schemas/workspace-token.schema';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { WorkspaceModel } from '../models/workspace.model';
import { QueryparamsWorkspaceModel } from '../models/queryparams.model';
import { QueryBuilderModel } from '../models/querybuilder.model';
import { MONGO_KEYS } from 'src/shared/data/mongo-keys';
import { WorkspaceDTO } from '../dtos/workspace.dto';
import { WorkspaceTokenModel } from '../models/workspace-token.model';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { CreateJoinWorkspaceTokenDTO } from '../dtos/create-join-workspace-token.dto';
import { JoinWorkspaceDTO } from '../dtos/join-workspace.dto';
import { AddMemberDTO } from '../dtos/add-member.dto';
import { DashboardService } from 'src/dashboard/services/dashboard.service';
import { UpdateMemberDTO } from '../dtos/update-member.dto';
import { UserService } from 'src/users/services/user.service';
import { IfMemberDTO } from '../dtos/if-member.dto';
import { MailService } from 'src/mail/services/mail.service';

@Injectable()
export class WorkspaceService {
  mongoKeys = MONGO_KEYS;
  salt: number = Number(this.configService.get('SALT_ROUNDS'));

  constructor(
    @InjectModel(Workspace.name)
    private workspace: Model<WorkspaceDocument>,
    @InjectModel(WorkspaceToken.name)
    private join_workspace: Model<WorkspaceTokenDocument>,
    private configService: ConfigService,
    @Inject(forwardRef(() => DashboardService))
    private dashboardService: DashboardService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
  ) {}

  async getWorkspaces(
    queryparams: QueryparamsWorkspaceModel,
  ): Promise<HttpResponse> {
    const params = await this.queryBuilder(queryparams);
    if (params) {
      return this.workspace
        .find(params)
        .then((workspaces: Array<WorkspaceModel>) => {
          return {
            statusCode: 200,
            message: 'Workspaces fetched successfully',
            data: workspaces,
          };
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: 'Error while fetching workspaces',
          };
        });
    } else {
      return { statusCode: 400, message: 'Error no query params received' };
    }
  }

  async getAggregatedWorkspaces(
    queryparams: QueryparamsWorkspaceModel,
  ): Promise<HttpResponse> {
    const params = await this.queryBuilder(queryparams);
    if (params) {
      return this.workspace
        .find(params)
        .then(async (workspaces: Array<WorkspaceModel>) => {
          const aggregatedWorkspaces = [];
          await this.asyncForEach(
            workspaces,
            async (workspace: WorkspaceModel) => {
              const aggregatedWorkspace = await this.workspace
                .aggregate([
                  { $match: { _id: workspace._id } },
                  {
                    $lookup: {
                      from: 'dashboards',
                      localField: 'workspace_id',
                      foreignField: 'workspace_id',
                      as: 'dashboards',
                    },
                  },
                ])
                .exec();
              aggregatedWorkspaces.push(aggregatedWorkspace[0]);
            },
          );
          return {
            statusCode: 200,
            message: 'Workspaces fetched successfully',
            data: aggregatedWorkspaces,
          };
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: 'Error while fetching workspaces',
          };
        });
    } else {
      return { statusCode: 400, message: 'Error no query params received' };
    }
  }

  async asyncForEach(array: Array<any>, callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  async addWorkspace(payload: WorkspaceDTO): Promise<HttpResponse> {
    let workspace: WorkspaceModel = payload;
    workspace.team = [{ _id: workspace.created_by, role: 'Owner' }];
    workspace.workspace_id = await this.generateId();
    const newWorkspace = new this.workspace(workspace);
    return newWorkspace
      .save()
      .then(() => {
        return {
          statusCode: 201,
          message: 'Workspace created successfully',
          data: workspace,
        };
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while trying to save workspace',
        };
      });
  }

  async updateWorkspace(
    updatedWorkspace: WorkspaceModel,
  ): Promise<HttpResponse> {
    return await this.workspace
      .updateOne({ _id: updatedWorkspace._id }, updatedWorkspace)
      .then((res) => {
        if (res.modifiedCount > 0) {
          return {
            statusCode: 200,
            message: 'Workspace updated successfully',
            data: updatedWorkspace,
          };
        } else {
          return {
            statusCode: 400,
            message: "Error couldn't find workspace",
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while updating workspace',
        };
      });
  }

  async deleteWorkspace(
    queryparams: QueryparamsWorkspaceModel,
  ): Promise<HttpResponse> {
    const params = await this.queryBuilder(queryparams);
    if (params) {
      return await this.workspace
        .findOneAndDelete(params)
        .then(async (workspace: WorkspaceModel) => {
          return this.dashboardService.deleteMultipleDashboards(workspace._id);
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: 'Error while trying to delete workspace',
          };
        });
    } else {
      return { statusCode: 400, message: 'Error no query params received' };
    }
  }

  async createJoinWorkspaceToken(
    obj: CreateJoinWorkspaceTokenDTO,
  ): Promise<HttpResponse> {
    return this.join_workspace
      .findOne({ workspace_id: obj.workspace_id, email: obj.email })
      .exec()
      .then(async (response) => {
        if (response) {
          this.join_workspace
            .deleteOne({ workspace_id: obj.workspace_id, email: obj.email })
            .exec()
            .then((res) => {
              if (res.deletedCount === 0) {
                return {
                  statusCode: 400,
                  message: `Error couldn't find join token`,
                };
              }
            });
        }
        const token = randomBytes(32).toString('hex');
        const hash: string = await bcrypt.hash(token, this.salt);
        const currentDatePlusThreeDays = Date.now() + 259200000;
        const newUser = await this.userService.getUser({ email: obj.email });
        const tokenObj: WorkspaceTokenModel = {
          user_id: newUser.data ? newUser.data._id.toString() : undefined,
          email: obj.email,
          workspace_id: obj.workspace_id,
          token: hash,
          expire: currentDatePlusThreeDays,
        };
        const newJoinToken = new this.join_workspace(tokenObj);
        return newJoinToken
          .save()
          .then(async () => {
            const { user_id, expire, ...mail } = tokenObj;
            await this.mailService.addMember(mail);
            return {
              statusCode: 201,
              message: `Created join workspace token successfully`,
              data: tokenObj,
            };
          })
          .catch(() => {
            return {
              statusCode: 400,
              message: `Error when adding join workspace token`,
            };
          });
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error while chekking for join workspace token`,
        };
      });
  }

  async joinWorkspace(joinObj: JoinWorkspaceDTO): Promise<HttpResponse> {
    return this.join_workspace
      .findOne({ email: joinObj.email, workspace_id: joinObj.workspace_id })
      .exec()
      .then(async (response) => {
        if (response) {
          const expireDate = response.expire;
          const currentDate = Date.now();
          return this.getWorkspaces({
            id: joinObj.workspace_id,
          })
            .then((res: HttpResponse) => {
              if (
                Number(currentDate) < Number(expireDate) &&
                joinObj.token === response.token
              ) {
                this.deleteWorkspaceToken(joinObj.email, joinObj.workspace_id);
                return this.addTeamMember({
                  workspace_id: joinObj.workspace_id,
                  user_id: response.user_id,
                  role: 'Member',
                });
              } else {
                this.deleteWorkspaceToken(joinObj.email, joinObj.workspace_id);
                return {
                  statusCode: 404,
                  message: 'Error invalid or expired join workspace token',
                };
              }
            })
            .catch(() => {
              return {
                statusCode: 400,
                message: `Error while fetching workspace`,
              };
            });
        } else {
          return {
            statusCode: 400,
            message: "Error couldn't find join workspace token",
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

  async deleteWorkspaceToken(email: string, workspace_id): Promise<void> {
    await this.join_workspace
      .deleteOne({ email: email, workspace_id: workspace_id })
      .exec();
  }

  async addTeamMember(addMember: AddMemberDTO): Promise<HttpResponse> {
    return await this.getWorkspaces({
      workspace_id: addMember.workspace_id,
    })
      .then((workspace: HttpResponse) => {
        if (workspace.statusCode === 200) {
          const member = {
            _id: addMember.user_id,
            role: addMember.role,
          };
          const index: number = workspace.data[0].team.indexOf(
            (member) => member._id === addMember.user_id,
          );
          if (index === -1) {
            workspace.data[0].team.push(member);
            return this.workspace
              .updateOne(
                { workspace_id: addMember.workspace_id },
                workspace.data[0],
              )
              .then(() => {
                return {
                  statusCode: 200,
                  message: `Added team member`,
                  data: workspace.data[0],
                };
              })
              .catch(() => {
                return {
                  statusCode: 400,
                  message: `Error while updating workspace team members`,
                };
              });
          } else {
            return {
              statusCode: 400,
              message: `Error member is already in the team`,
            };
          }
        } else {
          return {
            statusCode: 400,
            message: `Error couldn't find workspace`,
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error while fetching workspace`,
        };
      });
  }

  async updateTeamMember(members: UpdateMemberDTO): Promise<HttpResponse> {
    return await this.workspace
      .updateOne({ workspace_id: members.workspace_id }, { team: members.team })
      .then((res) => {
        if (res.modifiedCount > 0) {
          return {
            statusCode: 200,
            message: 'Workspace updated successfully',
            data: members.team,
          };
        } else {
          return {
            statusCode: 400,
            message: "Error couldn't find workspace",
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while updating workspace',
        };
      });
  }

  async deleteTeamMember(queryparams: QueryparamsWorkspaceModel) {
    return this.getWorkspaces({ workspace_id: queryparams.workspace_id })
      .then((workspace: HttpResponse) => {
        if (workspace.statusCode === 200) {
          const index = workspace.data[0].team.findIndex(
            (obj: { role: string; _id: string }) =>
              obj._id === queryparams.user_id,
          );
          if (index > -1) {
            workspace.data[0].team.splice(index, 1);
            if (workspace.data[0].team.length > 0) {
              return this.workspace
                .updateOne(
                  { workspace_id: queryparams.workspace_id },
                  workspace.data[0],
                )
                .then(() => {
                  return {
                    statusCode: 200,
                    message: `Deleted workspace member successfully`,
                    data: workspace.data[0],
                  };
                })
                .catch(() => {
                  return {
                    statusCode: 400,
                    message: `Error while updating workspace member`,
                  };
                });
            } else {
              return {
                statusCode: 400,
                message: `Error couldn't delete last workspace member`,
              };
            }
          } else {
            return {
              statusCode: 400,
              message: `Error couldn't find workspace member`,
            };
          }
        } else {
          return {
            statusCode: 400,
            message: `Error couldn't find workspace`,
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error while fetching workspace`,
        };
      });
  }

  async checkIfMember(user: IfMemberDTO): Promise<HttpResponse> {
    return this.getWorkspaces({
      workspace_id: user.workspace_id,
      member: user.user_id,
    })
      .then((res: HttpResponse) => {
        if (res.data.length > 0) {
          return {
            statusCode: 200,
            message: `Member is part of the workspace`,
            data: true,
          };
        } else {
          return {
            statusCode: 200,
            message: `Member is not part of the workspace`,
            data: false,
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error while fetching workspace`,
        };
      });
  }

  async generateId(): Promise<string> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async queryBuilder(obj: QueryBuilderModel) {
    const params = JSON.parse(JSON.stringify(obj));
    if (Object.keys(params).length === 0) {
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
