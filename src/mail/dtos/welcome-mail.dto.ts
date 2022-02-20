import { IsDefined, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WelcomeMailDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  username: string;

  @ApiProperty({ required: true })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  id: string;
}
