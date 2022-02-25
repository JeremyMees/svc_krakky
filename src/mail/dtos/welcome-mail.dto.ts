import { IsDefined, IsEmail, IsString } from 'class-validator';

export class WelcomeMailDTO {
  @IsString()
  @IsDefined()
  username: string;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  id: string;
}
