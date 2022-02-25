import { IsDefined, IsString, Length } from 'class-validator';
export class UsernameDTO {
  @IsString()
  @IsDefined()
  @Length(4, 12)
  username: string;
}
