import { IsDefined, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoodbyeMailDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  username: string;

  @ApiProperty({ required: true })
  @IsEmail()
  @IsDefined()
  email: string;
}
