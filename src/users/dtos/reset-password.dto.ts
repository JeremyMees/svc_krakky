import { IsString, Length } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @Length(6, 20)
  password: string;

  @IsString()
  user_id: string;

  @IsString()
  token: string;
}
