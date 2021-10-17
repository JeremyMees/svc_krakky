import { IsEmail, IsString, Length } from 'class-validator';

export class CredentialsDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
