import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddCardDTO } from './dtos/add-card.dto';
import { CardService } from './services/card.service';

@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  async addCard(@Body() card: AddCardDTO): Promise<HttpResponse> {
    return await this.cardService.addCard(card);
  }
}
