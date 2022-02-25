import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddCardDTO } from './dtos/add-card.dto';
import { QueryparamsCardModel } from './models/queryparams-card.model';
import { CardService } from './services/card.service';
import { UpdateCardDTO } from './dtos/update-card.dto';
import { GetAssigneesDTO } from './dtos/assignees.dto';
@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Get('created_by/:user_id')
  async getCardsCreatedBy(
    @Param() params: QueryparamsCardModel,
  ): Promise<HttpResponse> {
    return await this.cardService.getCardsCreatedBy(params);
  }

  @Get('assigned/:user_id')
  async getCardsAssigned(
    @Param() params: QueryparamsCardModel,
  ): Promise<HttpResponse> {
    return await this.cardService.getCardsAssigned(params);
  }

  @Post('')
  async addCard(@Body() card: AddCardDTO): Promise<HttpResponse> {
    return await this.cardService.addCard(card);
  }

  @Post('assignees')
  async getAssignees(
    @Body() assignees: GetAssigneesDTO,
  ): Promise<HttpResponse> {
    return await this.cardService.getAssignees(assignees);
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
