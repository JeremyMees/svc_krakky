import { IsDefined, IsString, Length } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsDefined()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsDefined()
  user_id: string;

  @IsString()
  @IsDefined()
  token: string;
}
