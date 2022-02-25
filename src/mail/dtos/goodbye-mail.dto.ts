import { IsDefined, IsEmail, IsString } from 'class-validator';

export class GoodbyeMailDTO {
  @IsString()
  @IsDefined()
  username: string;

  @IsEmail()
  @IsDefined()
  email: string;
}
