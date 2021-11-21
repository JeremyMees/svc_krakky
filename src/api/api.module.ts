import { Module } from '@nestjs/common';
import { ApiService } from './services/api.service';
import { ApiController } from './api.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiToken, ApiTokenSchema } from './schema/api-token.schema';

@Module({
  providers: [ApiService],
  controllers: [ApiController],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: ApiToken.name, schema: ApiTokenSchema },
    ]),
  ],
})
export class ApiModule {}
