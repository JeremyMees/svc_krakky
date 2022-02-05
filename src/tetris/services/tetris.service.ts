import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddScoreDTO } from '../dtos/add-score.dto';
import { ScoreModel } from '../models/score.model';
import { Score, ScoreDocument } from '../schemas/score.schema';

@Injectable()
export class TetrisService {
  constructor(
    @InjectModel(Score.name)
    private score: Model<ScoreDocument>,
  ) {}

  async getHighscores(): Promise<HttpResponse> {
    return this.score
      .find()
      .sort({ score: -1 })
      .limit(10)
      .then((scores: Array<ScoreModel>) => {
        return {
          message: 'Fetched highscores succesfully',
          statusCode: 200,
          data: scores,
        };
      })
      .catch(() => {
        return { message: 'Error fetching highscores', statusCode: 400 };
      });
  }

  async getPersonalHighscore(id: string): Promise<HttpResponse> {
    return this.score
      .find({ user_id: id })
      .sort({ score: -1 })
      .limit(1)
      .then((scores: Array<ScoreModel>) => {
        return {
          message: 'Fetched highscore succesfully',
          statusCode: 200,
          data: scores,
        };
      })
      .catch(() => {
        return { message: 'Error fetching highscore', statusCode: 400 };
      });
  }

  async addHighscore(score: AddScoreDTO): Promise<HttpResponse> {
    const newScore = new this.score(score);
    return newScore
      .save()
      .then(() => {
        return {
          statusCode: 201,
          message: 'Highscore created succesfully',
          data: score,
        };
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while trying to save Highscore',
        };
      });
  }
}
