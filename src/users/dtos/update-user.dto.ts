import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  @Length(6, 20)
  password: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  _id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Length(6, 20)
  new_password: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Length(4, 12)
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  verified: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  marketing: boolean;
}
