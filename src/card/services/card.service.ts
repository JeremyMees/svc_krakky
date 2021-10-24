import { Injectable } from '@nestjs/common';
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

@Injectable()
export class CardService {
  mongoKeys = MONGO_KEYS;
  constructor(
    @InjectModel(Card.name)
    private card: Model<CardDocument>,
    private listService: ListService,
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

  async addCard(card: CardModel): Promise<HttpResponse> {
    const cards: Array<CardModel> = await this.getCards({
      list_id: card.list_id,
    });
    return this.listService
      .getLists({ list_id: card.list_id })
      .then((lists: Array<ListModel>) => {
        if (lists.length > 0) {
          card.color === undefined ? (card.color = 'white') : null;
          card.assignees === undefined ? (card.assignees = []) : null;
          card.index = cards.length;
          const newCard = new this.card(card);
          return newCard
            .save()
            .then(() => {
              return {
                statusCode: 201,
                message: 'Card created succesfully',
                data: card,
              };
            })
            .catch((err) => {
              console.log(err);
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
