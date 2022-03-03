import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListModel } from 'src/list/models/list.model';
import { ListService } from 'src/list/services/list.service';
import { MONGO_KEYS } from 'src/shared/data/mongo-keys';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { QueryBuilderModel } from 'src/workspace/models/querybuilder.model';
import { CardModel } from '../models/card.model';
import { QueryparamsCardModel } from '../models/queryparams-card.model';
import { Card, CardDocument } from '../schemas/card.schema';
import { UpdateCardDTO } from '../dtos/update-card.dto';
import { AssigneeModel } from '../models/assignee.model';
import { UserService } from 'src/users/services/user.service';
import { GetAssigneesDTO } from '../dtos/assignees.dto';
import { DashboardService } from 'src/dashboard/services/dashboard.service';
@Injectable()
export class CardService {
  mongoKeys = MONGO_KEYS;
  constructor(
    @InjectModel(Card.name)
    private card: Model<CardDocument>,
    @Inject(forwardRef(() => ListService))
    private listService: ListService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async getCards(queryparams: QueryparamsCardModel): Promise<Array<CardModel>> {
    const params = await this.queryBuilder(queryparams);
    return this.card
      .find(params)
      .then((cards: Array<CardModel>) => {
        return cards;
      })
      .catch(() => {
        return [];
      });
  }

  async getCardsCreatedBy(params: QueryparamsCardModel): Promise<HttpResponse> {
    if (params.user_id) {
      return this.card
        .find({ created_by: params.user_id })
        .then((cards: Array<CardModel>) => {
          return {
            statusCode: 200,
            message: 'Fetched cards successfully',
            data: cards,
          };
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: 'Error while fetching cards',
          };
        });
    } else {
      return {
        statusCode: 400,
        message: 'No user id provided',
      };
    }
  }

  async getCardsAssigned(params: QueryparamsCardModel): Promise<HttpResponse> {
    if (params.user_id) {
      return this.card
        .find({ 'assignees._id': params.user_id })
        .then((cards: Array<CardModel>) => {
          return {
            statusCode: 200,
            message: 'Fetched cards successfully',
            data: cards,
          };
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: 'Error while fetching cards',
          };
        });
    } else {
      return {
        statusCode: 400,
        message: 'No user id provided',
      };
    }
  }

  async addCard(card: CardModel): Promise<HttpResponse> {
    const cards: Array<CardModel> = await this.getCards({
      list_id_card: card.list_id,
    });
    return this.listService
      .getLists({ list_id: card.list_id })
      .then((lists: Array<ListModel>) => {
        if (lists.length > 0) {
          card.color === undefined ? (card.color = 'white') : null;
          card.assignees === undefined ? (card.assignees = []) : null;
          card.updated_at = card.created_at;
          if (cards.length === 0) {
            card.index = 0;
          } else {
            const highest_index_card: CardModel = cards.reduce(
              (prev: CardModel, current: CardModel) =>
                prev.index > current.index ? prev : current,
            );
            card.index = highest_index_card.index + 1;
          }
          const newCard = new this.card(card);
          return newCard
            .save()
            .then(() => {
              return {
                statusCode: 201,
                message: 'Card created successfully',
                data: card,
              };
            })
            .catch(() => {
              return {
                statusCode: 400,
                message: 'Error while trying to save card',
              };
            });
        } else {
          return {
            statusCode: 400,
            message: "Error couldn't find list to add card",
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while fetching list',
        };
      });
  }

  async updateCard(card: UpdateCardDTO): Promise<HttpResponse> {
    const id: string = card._id;
    delete card.board_id;
    delete card._id;
    const updated_card: any = card;
    updated_card.updated_at = Date.now();
    return this.card
      .updateOne({ _id: id }, updated_card)
      .then(() => {
        return {
          statusCode: 200,
          message: 'Updated card successfully',
        };
      })
      .catch(() => {
        return { statusCode: 400, message: 'Error while updating card' };
      });
  }

  async deleteCard(queryparams: QueryparamsCardModel): Promise<HttpResponse> {
    const params = await this.queryBuilder(queryparams);
    if (params) {
      return await this.card
        .deleteOne(params)
        .then(() => {
          const card_id: boolean = '_id' in queryparams;
          return card_id
            ? { statusCode: 200, message: 'Deleted card successfully' }
            : {
                statusCode: 200,
                data: { _id: queryparams._id },
                message: 'Deleted card successfully',
              };
        })
        .catch(() => {
          return {
            statusCode: 400,
            message: 'Error while trying to delete card',
          };
        });
    } else {
      return { statusCode: 400, message: 'Error no query params received' };
    }
  }

  async deleteMultipleCards(id: {
    list_id?: string;
    board_id?: string;
  }): Promise<HttpResponse> {
    return this.card
      .deleteMany(id)
      .then(() => {
        return {
          statusCode: 200,
          data: {
            _id: id.list_id,
          },
          message: 'Deleted list and coherent cards successfully',
        };
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while trying to delete coherent cards',
        };
      });
  }

  async getAssignees(body: GetAssigneesDTO): Promise<HttpResponse> {
    let assignees: Array<AssigneeModel> = [];
    await this.asyncForEach(
      body.assignees,
      async (assignee: { _id: string }) => {
        await this.userService
          .getUser({ id: assignee._id })
          .then((res: HttpResponse) => {
            if (res.statusCode === 200) {
              assignees.push({
                _id: res.data._id,
                email: res.data.email,
                img: res.data.img,
                img_query: res.data.img_query,
                username: res.data.username,
              });
            } else {
              return res;
            }
          });
      },
    );
    return {
      statusCode: 200,
      message: `Assignees fetched successfullly`,
      data: assignees,
    };
  }

  async asyncForEach(array: any, callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
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
