import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MONGO_KEYS } from 'src/shared/data/mongo-keys';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { CreateApiTokenDTO } from '../dtos/add-api-token.dto';
import { GetApiTokenDTO } from '../dtos/get-api-token.dto';
import { ApiToken, ApiTokenDocument } from '../schema/api-token.schema';
import { randomBytes } from 'crypto';
import { DeleteApiTokenDTO } from '../dtos/delete-api-token.dto';

@Injectable()
export class ApiService {
  mongoKeys = MONGO_KEYS;

  constructor(
    @InjectModel(ApiToken.name)
    private api_token: Model<ApiTokenDocument>,
  ) {}

  async getApiToken(payload: GetApiTokenDTO): Promise<HttpResponse> {
    return await this.api_token
      .findOne(payload)
      .then((tokenObj: ApiToken) => {
        if (tokenObj) {
          return {
            statusCode: 200,
            message: 'Api key fetched successfully',
            data: tokenObj,
          };
        } else {
          return {
            statusCode: 404,
            message: 'Api key not found',
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while fetching api key',
        };
      });
  }

  async postApiToken(tokenObj: CreateApiTokenDTO): Promise<HttpResponse> {
    const token = randomBytes(32).toString('hex');
    const newToken = new this.api_token({ ...tokenObj, token });
    return await newToken
      .save()
      .then(() => {
        return {
          statusCode: 201,
          message: 'Api key fetched successfully',
          data: { ...tokenObj, token },
        };
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while saving api key',
        };
      });
  }

  async deleteApiToken(payload: DeleteApiTokenDTO): Promise<HttpResponse> {
    return await this.api_token
      .deleteOne({ _id: payload.id })
      .then(() => {
        return {
          statusCode: 200,
          message: 'Succesfully deleted api key',
        };
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while trying to delete api key',
        };
      });
  }
}
