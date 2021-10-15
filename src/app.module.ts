import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

const databseUrl = `mongodb+srv://jeremy:vW58aKqyqWOyWTAj@ticketz.qnaij.mongodb.net/ticketz?retryWrites=true&w=majority`;

@Module({
  imports: [
    MongooseModule.forRoot(databseUrl),
    ConfigModule.forRoot(),
    HttpModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
