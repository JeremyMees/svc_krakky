import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListService } from 'src/list/services/list.service';
import { MONGO_KEYS } from 'src/shared/data/mongo-keys';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { QueryBuilderModel } from 'src/workspace/models/querybuilder.model';
import { WorkspaceService } from 'src/workspace/services/workspace.service';
import { AddDashboardDTO } from '../dtos/add-dashboard.dto';
import { UpdateDashboardDTO } from '../dtos/update-dashboard.dto';
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
              localField: 'boardId',
              foreignField: 'boardId',
              as: 'cards',
            },
          },
          {
            $lookup: {
              from: 'lists',
              localField: 'boardId',
              foreignField: 'boardId',
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
    dashboard.board_id = await this.generateId();
    return this.getDashboards({
      createdby: dashboard.created_by,
      title: dashboard.title,
    })
      .then((response: HttpResponse) => {
        if (response.data.length === 0) {
          return this.workspaceService
            .getWorkspaces({
              name: dashboard.workspace,
              id: dashboard.workspace_id,
            })
            .then((workspace: HttpResponse) => {
              if (workspace.data.length > 0) {
                const newDashboard = new this.dashboard(dashboard);
                return newDashboard
                  .save()
                  .then(() => {
                    return {
                      statusCode: 201,
                      message: 'Dashboard created succesfully',
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
    return this.dashboard
      .updateOne({ board_id: dashboard.board_id }, dashboard)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Updated dashboard succesfully',
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
              .deleteMany({ workspace: dashboard.workspace })
              .then(async () => {
                this.listService.deleteMultipleLists({
                  board_id: dashboard.board_id,
                });
              });
          });
          return {
            statusCode: 200,
            message:
              'Deleted workspace and coherent dashboards, lists and cards succesfully',
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
