import { Body, Controller, Post } from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddTagDTO } from './dtos/add-tag.dto';
import { TagService } from './services/tag/tag.service';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post()
  async addTag(@Body() tag: AddTagDTO): Promise<HttpResponse> {
    return await this.tagService.addTag(tag);
  }
}
