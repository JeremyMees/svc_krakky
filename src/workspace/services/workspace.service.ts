import { Injectable } from '@nestjs/common';
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

  async addWorkspace(workspace: WorkspaceDTO): Promise<HttpResponse> {
    workspace.team = [{ _id: workspace.created_by, role: 'Owner' }];
    const newWorkspace = new this.workspace(workspace);
    return newWorkspace
      .save()
      .then(() => {
        return {
          statusCode: 201,
          message: 'Workspace created succesfully',
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
            message: 'Workspace updated succesfully',
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
        .deleteOne(params)
        .then(() => {
          return { statusCode: 200, message: 'Deleted workspace succesfully' };
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
      .findOne({ workspace_id: obj.workspace_id, user_id: obj.user_id })
      .exec()
      .then(async (response) => {
        if (response) {
          this.join_workspace
            .deleteOne({ workspace_id: obj.workspace_id, user_id: obj.user_id })
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
        const tokenObj: WorkspaceTokenModel = {
          user_id: obj.user_id,
          workspace_id: obj.workspace_id,
          token: hash,
          expire: currentDatePlusThreeDays,
        };
        const newJoinToken = new this.join_workspace(tokenObj);
        return newJoinToken
          .save()
          .then(() => {
            return {
              statusCode: 201,
              message: `Created join workspace token succesfully`,
              data: tokenObj,
            };
          })
          .catch((err) => {
            console.log(err);
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
      .findOne({ user_id: joinObj.user_id, workspace_id: joinObj.workspace_id })
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
                return this.addTeamMember({
                  workspace_id: joinObj.workspace_id,
                  user_id: joinObj.user_id,
                  role: 'Member',
                });
              } else {
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

  async addTeamMember(addMember: AddMemberDTO): Promise<HttpResponse> {
    return await this.getWorkspaces({
      member: addMember.user_id,
      id: addMember.workspace_id,
    })
      .then((workspace: HttpResponse) => {
        if (workspace.statusCode === 200) {
          const member = {
            _id: addMember.user_id,
            role: addMember.role,
          };
          if (workspace.data[0].team.indexOf(member) > -1) {
            workspace.data[0].team.push(member);
            return this.workspace
              .updateOne({ _id: addMember.workspace_id }, workspace.data[0])
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

  async deleteTeamMember(queryparams: QueryparamsWorkspaceModel) {
    return this.getWorkspaces({ id: queryparams.workspace_id })
      .then((workspace: HttpResponse) => {
        if (workspace.statusCode === 200) {
          const index = workspace.data[0].team.findIndex(
            (obj) => obj._id === queryparams.user_id,
          );
          if (index > -1) {
            workspace.data[0].team.splice(index, 1);
            if (workspace.data[0].team.length > 0) {
              return this.workspace
                .updateOne({ _id: queryparams.workspace_id }, workspace.data[0])
                .then(() => {
                  return {
                    statusCode: 200,
                    message: `Deleted workspace member succesfully`,
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
