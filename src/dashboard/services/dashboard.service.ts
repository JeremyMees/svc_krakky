import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListService } from 'src/list/services/list.service';
import { MONGO_KEYS } from 'src/shared/data/mongo-keys';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { UserService } from 'src/users/services/user.service';
import { QueryBuilderModel } from 'src/workspace/models/querybuilder.model';
import { WorkspaceService } from 'src/workspace/services/workspace.service';
import { AddDashboardDTO } from '../dtos/add-dashboard.dto';
import { AddMemberDTO } from '../dtos/add-member-dashboard.dto';
import { IfMemberDTO } from '../dtos/if-member-dashboard.dto';
import { UpdateDashboardDTO } from '../dtos/update-dashboard.dto';
import { UpdateMemberDTO } from '../dtos/update-member-dashboard.dto';
import { AggregateDashboardModel } from '../models/aggregate-dashboard.model';
import { DashboardModel } from '../models/dashboard.model';
import { QueryparamsDashboardModel } from '../models/queryparams-dashboard.model';
import { Dashboard, DashboardDocument } from '../schemas/dashboard.schema';

@Injectable()
export class DashboardService {
  mongoKeys = MONGO_KEYS;
  constructor(
    @InjectModel(Dashboard.name)
    private dashboard: Model<DashboardDocument>,
    @Inject(forwardRef(() => WorkspaceService))
    private workspaceService: WorkspaceService,
    @Inject(forwardRef(() => ListService))
    private listService: ListService,
  ) {}

  async getDashboards(
    queryparams: QueryparamsDashboardModel,
  ): Promise<HttpResponse> {
    const params = await this.queryBuilder(queryparams);
    if (params) {
      return this.dashboard
        .find(params)
        .then((dashboards: Array<DashboardModel>) => {
          return {
            statusCode: 200,
            message: 'Dashboards fetched successfully',
            data: dashboards,
          };
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: 'Error while fetching dashboards',
          };
        });
    } else {
      return { statusCode: 400, message: 'Error no query params received' };
    }
  }

  async getAggregatedDashboard(
    queryparams: QueryparamsDashboardModel,
  ): Promise<HttpResponse> {
    if (queryparams) {
      return this.dashboard
        .aggregate<AggregateDashboardModel>([
          { $match: { board_id: queryparams.board_id } },
          {
            $lookup: {
              from: 'cards',
              localField: 'board_id',
              foreignField: 'board_id',
              as: 'cards',
            },
          },
          {
            $lookup: {
              from: 'lists',
              localField: 'board_id',
              foreignField: 'board_id',
              as: 'lists',
            },
          },
        ])
        .then((dashboard: Array<AggregateDashboardModel>) => {
          if (dashboard.length > 0) {
            return {
              statusCode: 200,
              message: 'Dashboard fetched successfully',
              data: dashboard[0],
            };
          } else {
            return {
              statusCode: 400,
              message: "Error couldn't find dashboard with that id",
            };
          }
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: 'Error while aggregating dashboard',
          };
        });
    } else {
      return { statusCode: 400, message: 'Error no query params received' };
    }
  }

  async addDashboard(dashboard: AddDashboardDTO): Promise<HttpResponse> {
    const new_dashboard = dashboard as DashboardModel;
    new_dashboard.board_id = await this.generateId();
    new_dashboard.created_at = Date.now();
    new_dashboard.updated_at = new_dashboard.created_at;
    return this.getDashboards({
      createdby: dashboard.created_by,
      title: dashboard.title,
    })
      .then((response: HttpResponse) => {
        if (response.data.length === 0) {
          return this.workspaceService
            .getWorkspaces({
              workspace_id: dashboard.workspace_id,
            })
            .then((workspace: HttpResponse) => {
              if (workspace.data.length > 0) {
                const newDashboard = new this.dashboard(new_dashboard);
                return newDashboard
                  .save()
                  .then(() => {
                    return {
                      statusCode: 201,
                      message: 'Dashboard created successfully',
                      data: dashboard,
                    };
                  })
                  .catch(() => {
                    return {
                      statusCode: 400,
                      message: 'Error while trying to save dashboard',
                    };
                  });
              } else {
                return {
                  statusCode: 400,
                  message:
                    "Error can't add dashboard to non existing workspace",
                };
              }
            })
            .catch(() => {
              return {
                statusCode: 400,
                message: 'Error while fetching workspace',
              };
            });
        } else {
          return {
            statusCode: 400,
            message: 'Error you already have a dashboard with that name',
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while checking if dashboard name is unique',
        };
      });
  }

  async updateDashboard(dashboard: UpdateDashboardDTO): Promise<HttpResponse> {
    const id: string = dashboard.board_id;
    delete dashboard.board_id;
    const updated_dashboard = dashboard as DashboardModel;
    updated_dashboard.updated_at = Date.now();
    return this.dashboard
      .updateOne({ board_id: id }, updated_dashboard)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Updated dashboard successfully',
        };
      })
      .catch(() => {
        return { statusCode: 400, message: 'Error while updating dashboard' };
      });
  }

  async deleteDashboard(id: string): Promise<HttpResponse> {
    if (id) {
      return await this.dashboard
        .deleteOne({ board_id: id })
        .then(() => {
          return this.listService.deleteMultipleLists({ board_id: id });
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: 'Error while trying to delete dashboard',
          };
        });
    } else {
      return { statusCode: 400, message: 'Error no query params received' };
    }
  }

  async deleteMultipleDashboards(workspace_id: string): Promise<HttpResponse> {
    return this.getDashboards({ workspace_id }).then(
      async (response: HttpResponse) => {
        if (response.statusCode === 200 && response.data.length > 0) {
          response.data.forEach(async (dashboard: DashboardModel) => {
            this.dashboard
              .deleteMany({ workspace: dashboard.workspace_id })
              .then(async () => {
                this.listService.deleteMultipleLists({
                  board_id: dashboard.board_id,
                });
              });
          });
          return {
            statusCode: 200,
            message:
              'Deleted workspace and coherent dashboards, lists and cards successfully',
          };
        } else {
          return {
            statusCode: 200,
            message: 'Workspace deleted successfully',
          };
        }
      },
    );
  }

  async addTeamMember(addMember: AddMemberDTO): Promise<HttpResponse> {
    return await this.getDashboards({
      board_id: addMember.board_id,
    })
      .then((dashboard: HttpResponse) => {
        if (dashboard.statusCode === 200) {
          const member = {
            _id: addMember.user_id,
            role: addMember.role,
          };
          if (dashboard.data[0].team.indexOf(member) === -1) {
            dashboard.data[0].updated_at = Date.now();
            dashboard.data[0].team.push(member);
            return this.dashboard
              .updateOne({ board_id: addMember.board_id }, dashboard.data[0])
              .then(() => {
                return {
                  statusCode: 200,
                  message: `Added team member`,
                  data: dashboard.data[0],
                };
              })
              .catch(() => {
                return {
                  statusCode: 400,
                  message: `Error while updating dashboard team members`,
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
            message: `Error couldn't find dashboard`,
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error while fetching dashboard`,
        };
      });
  }

  async updateTeamMember(members: UpdateMemberDTO): Promise<HttpResponse> {
    return await this.dashboard
      .updateOne(
        { board_id: members.board_id },
        { team: members.team, updated_at: Date.now() },
      )
      .then((res) => {
        if (res.modifiedCount > 0) {
          return {
            statusCode: 200,
            message: 'Dashboard updated successfully',
            data: members.team,
          };
        } else {
          return {
            statusCode: 400,
            message: "Error couldn't find dashboard",
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while updating dashboard',
        };
      });
  }

  async deleteTeamMember(queryparams: QueryparamsDashboardModel) {
    return this.getDashboards({ id: queryparams.board_id })
      .then((dashboard: HttpResponse) => {
        if (dashboard.statusCode === 200) {
          const index = dashboard.data[0].team.findIndex(
            (obj) => obj._id === queryparams.user_id,
          );
          if (index > -1) {
            dashboard.data[0].team.splice(index, 1);
            if (dashboard.data[0].team.length > 0) {
              return this.dashboard
                .updateOne({ _id: queryparams.board_id }, dashboard.data[0])
                .then(() => {
                  return {
                    statusCode: 200,
                    message: `Deleted dashboard member successfully`,
                    data: dashboard.data[0],
                  };
                })
                .catch(() => {
                  return {
                    statusCode: 400,
                    message: `Error while updating dashboard member`,
                  };
                });
            } else {
              return {
                statusCode: 400,
                message: `Error couldn't delete last dashboard member`,
              };
            }
          } else {
            return {
              statusCode: 400,
              message: `Error couldn't find dashboard member`,
            };
          }
        } else {
          return {
            statusCode: 400,
            message: `Error couldn't find dashboard`,
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error while fetching dashboard`,
        };
      });
  }

  async checkIfMember(user: IfMemberDTO): Promise<HttpResponse> {
    return this.getDashboards({
      board_id: user.board_id,
      member: user.user_id,
    })
      .then((res: HttpResponse) => {
        if (res.data.length > 0) {
          return {
            statusCode: 200,
            message: `Member is part of the dashboard`,
            data: true,
          };
        } else {
          return {
            statusCode: 200,
            message: `Member is not part of the dashboard`,
            data: false,
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: `Error while fetching dashboard`,
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
