import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  @Length(6, 20)
  password: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  @Length(4, 12)
  username: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  img: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  img_query: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  verified: boolean;
}
