import { IsEmail, IsString, Length } from 'class-validator';

export class UserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsString()
  @Length(4, 12)
  username: string;
}
