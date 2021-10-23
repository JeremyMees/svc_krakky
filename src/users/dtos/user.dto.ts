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

  @IsOptional()
  @IsBoolean()
  verified: boolean;
}
