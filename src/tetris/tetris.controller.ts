import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddScoreDTO } from './dtos/add-score.dto';
import { TetrisService } from './services/tetris.service';

@Controller('tetris')
export class TetrisController {
  constructor(private tetrisService: TetrisService) {}

  @Get()
  async getHighscores(): Promise<HttpResponse> {
    return await this.tetrisService.getHighscores();
  }

  @Get('/:id')
  async getPersonalHighscore(
    @Param() param: { id: string },
  ): Promise<HttpResponse> {
    return await this.tetrisService.getPersonalHighscore(param.id);
  }

  @Post()
  async addHighscore(@Body() score: AddScoreDTO): Promise<HttpResponse> {
    return await this.tetrisService.addHighscore(score);
  }
}
