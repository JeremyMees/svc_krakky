import { IsDefined, IsEmail, IsString } from 'class-validator';

export class ContactMailDTO {
  @IsString()
  @IsDefined()
  text: string;

  @IsString()
  @IsDefined()
  username: string;

  @IsEmail()
  @IsDefined()
  email: string;
}
