import { IsDefined, IsEmail, IsString } from 'class-validator';

export class ForgotMailDTO {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  token: string;
}
