import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddCardDTO } from './dtos/add-card.dto';
import { QueryparamsCardModel } from './models/queryparams-card.model';
import { CardService } from './services/card.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCardDTO } from './dtos/update-card.dto';
@ApiTags('Cards')
@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Post('')
  async addCard(@Body() card: AddCardDTO): Promise<HttpResponse> {
    return await this.cardService.addCard(card);
  }

  @Patch('')
  async updateCard(@Body() card: UpdateCardDTO): Promise<HttpResponse> {
    return await this.cardService.updateCard(card);
  }

  @Delete('/:id')
  async deleteCard(
    @Param() params: QueryparamsCardModel,
  ): Promise<HttpResponse> {
    return await this.cardService.deleteCard(params);
  }
}
