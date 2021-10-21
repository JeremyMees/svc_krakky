import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
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

@Injectable()
export class WorkspaceService {
  mongoKeys = MONGO_KEYS;
  constructor(
    private http: HttpService,
    @InjectModel(Workspace.name)
    private workspace: Model<WorkspaceDocument>,
    @InjectModel(WorkspaceToken.name)
    private token: Model<WorkspaceTokenDocument>,
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

  async queryBuilder(obj: QueryBuilderModel) {
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
