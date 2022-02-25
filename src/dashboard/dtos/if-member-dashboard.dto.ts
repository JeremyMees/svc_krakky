import { IsDefined, IsString } from 'class-validator';

export class IfMemberDTO {
  @IsString()
  @IsDefined()
  user_id: string;

  @IsString()
  @IsDefined()
  board_id: string;
}
