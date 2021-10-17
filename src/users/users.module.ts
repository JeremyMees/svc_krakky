import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ResetPassword,
  ResetPasswordSchema,
} from './schemas/reset-password-token.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ResetPassword.name, schema: ResetPasswordSchema },
    ]),
  ],
})
export class UserModule {}
