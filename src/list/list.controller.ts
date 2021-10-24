import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Inject,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddListDTO } from './dtos/add-list.dto';
import { QueryparamsListModel } from './models/queryparams-list.model';
import { ListService } from './services/list.service';

@Controller('list')
export class ListController {
  constructor(
    @Inject(forwardRef(() => ListService))
    private listService: ListService,
  ) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  async addList(@Body() list: AddListDTO): Promise<HttpResponse> {
    return await this.listService.addList(list);
  }

  @Delete('/:list_id')
  async deleteList(
    @Param() param: QueryparamsListModel,
  ): Promise<HttpResponse> {
    return await this.listService.deleteList(param.list_id);
  }
}
