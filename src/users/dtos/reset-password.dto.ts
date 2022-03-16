import { IsDefined, IsEmail, IsString, Length } from 'class-validator';
export class ResetPasswordDTO {
  @IsString()
  @IsDefined()
  @Length(6, 20)
  password: string;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  token: string;
}
