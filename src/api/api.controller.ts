import { Body, Controller, Delete, Post } from '@nestjs/common';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { CreateApiTokenDTO } from './dtos/add-api-token.dto';
import { DeleteApiTokenDTO } from './dtos/delete-api-token.dto';
import { GetApiTokenDTO } from './dtos/get-api-token.dto';
import { ApiService } from './services/api.service';

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Post('')
  async getApiToken(@Body() obj: GetApiTokenDTO): Promise<HttpResponse> {
    return await this.apiService.getApiToken(obj);
  }

  @Post('create')
  async postApiToken(@Body() obj: CreateApiTokenDTO): Promise<HttpResponse> {
    return await this.apiService.postApiToken(obj);
  }

  @Delete('')
  async deleteApiToken(@Body() obj: DeleteApiTokenDTO): Promise<HttpResponse> {
    return await this.apiService.deleteApiToken(obj);
  }
}
