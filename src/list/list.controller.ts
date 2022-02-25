import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddListDTO } from './dtos/add-list.dto';
import { QueryparamsListModel } from './models/queryparams-list.model';
import { ListService } from './services/list.service';
import { UpdateListDTO } from './dtos/update-list.dto';
@Controller('list')
export class ListController {
  constructor(
    @Inject(forwardRef(() => ListService))
    private listService: ListService,
  ) {}

  @Post('')
  async addList(@Body() list: AddListDTO): Promise<HttpResponse> {
    return await this.listService.addList(list);
  }

  @Patch('')
  async updateList(@Body() list: UpdateListDTO): Promise<HttpResponse> {
    return await this.listService.updateList(list);
  }

  @Delete('/:list_id')
  async deleteList(
    @Param() param: QueryparamsListModel,
  ): Promise<HttpResponse> {
    return await this.listService.deleteList(param.list_id);
  }
}
