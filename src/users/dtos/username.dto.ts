import { IsString, Length } from 'class-validator';

export class UsernameDTO {
  @IsString()
  @Length(4, 12)
  username: string;
}
