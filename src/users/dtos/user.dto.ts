import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UserDTO {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsDefined()
  @Length(4, 12)
  username: string;

  @IsString()
  @IsDefined()
  img: string;

  @IsString()
  @IsOptional()
  img_query: string;

  @IsOptional()
  @IsBoolean()
  verified: boolean;

  @IsDefined()
  @IsBoolean()
  marketing: boolean;
}
