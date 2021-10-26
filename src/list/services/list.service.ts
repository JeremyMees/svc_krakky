import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CardService } from 'src/card/services/card.service';
import { DashboardService } from 'src/dashboard/services/dashboard.service';
import { MONGO_KEYS } from 'src/shared/data/mongo-keys';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { QueryBuilderModel } from 'src/workspace/models/querybuilder.model';
import { AddListDTO } from '../dtos/add-list.dto';
import { UpdateListDTO } from '../dtos/update-list.dto';
import { ListModel } from '../models/list.model';
import { QueryparamsListModel } from '../models/queryparams-list.model';
import { List, ListDocument } from '../schemas/list.schema';

@Injectable()
export class ListService {
  mongoKeys = MONGO_KEYS;
  constructor(
    @InjectModel(List.name)
    private list: Model<ListDocument>,
    @Inject(forwardRef(() => DashboardService))
    private dashboardService: DashboardService,
    @Inject(forwardRef(() => CardService))
    private cardService: CardService,
  ) {}

  async getLists(queryparams: QueryparamsListModel): Promise<Array<ListModel>> {
    const params = await this.queryBuilder(queryparams);
    return this.list
      .find(params)
      .then((lists: Array<ListModel>) => {
        return lists;
      })
      .catch(() => {
        return [];
      });
  }

  async addList(list: AddListDTO): Promise<HttpResponse> {
    const lists: Array<ListModel> = await this.getLists({
      board_id: list.board_id,
    });
    return this.dashboardService
      .getDashboards({ board_id: list.board_id })
      .then((response: HttpResponse) => {
        if (response.data.length === 1) {
          const index: number = lists.findIndex(
            (obj: ListModel) => obj.title === list.title,
          );
          if (index < 0) {
            const newList = new this.list({
              board_id: list.board_id,
              title: list.title,
              index: lists.length,
            });
            return newList
              .save()
              .then(() => {
                return {
                  statusCode: 201,
                  message: 'List created succesfully',
                  data: {
                    board_id: list.board_id,
                    title: list.title,
                    index: lists.length,
                  },
                };
              })
              .catch(() => {
                return {
                  statusCode: 400,
                  message: 'Error while trying to save list',
                };
              });
          } else {
            return {
              statusCode: 400,
              message: 'Error you already have a list with that name',
            };
          }
        } else {
          return {
            statusCode: 400,
            message: "Error could't find dashboard to add list",
          };
        }
      });
  }

  async updateList(list: UpdateListDTO): Promise<HttpResponse> {
    return this.list
      .updateOne({ board_id: list.board_id }, list)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Updated list succesfully',
        };
      })
      .catch(() => {
        return { statusCode: 400, message: 'Error while updating list' };
      });
  }

  async deleteList(list_id: string): Promise<HttpResponse> {
    if (list_id) {
      return await this.list
        .deleteOne({ list_id })
        .then(() => {
          return this.cardService.deleteMultipleCards({ list_id: list_id });
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: 'Error while trying to delete list',
          };
        });
    } else {
      return { statusCode: 400, message: 'Error no query params received' };
    }
  }

  async deleteMultipleLists(id: { board_id?: string }): Promise<HttpResponse> {
    return this.list
      .deleteMany(id)
      .then(async () => {
        return this.cardService.deleteMultipleCards(id).then(() => {
          return {
            statusCode: 200,
            message:
              'Deleted dashboard and coherent lists and cards succesfully',
          };
        });
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while trying to delete coherent cards',
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
