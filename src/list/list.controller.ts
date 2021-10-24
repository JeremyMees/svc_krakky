import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddListDTO } from './dtos/add-list.dto';
import { ListService } from './services/list.service';

@Controller('list')
export class ListController {
  constructor(private listService: ListService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  async addList(@Body() list: AddListDTO): Promise<HttpResponse> {
    return await this.listService.addList(list);
  }
}
