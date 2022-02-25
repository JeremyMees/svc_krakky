import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDTO {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsDefined()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsDefined()
  _id: string;

  @IsString()
  @IsOptional()
  @Length(6, 20)
  new_password: string;

  @IsString()
  @IsOptional()
  @Length(4, 12)
  username: string;

  @IsOptional()
  @IsBoolean()
  verified: boolean;

  @IsOptional()
  @IsBoolean()
  marketing: boolean;
}
