import { IsDefined, IsEnum, IsString } from 'class-validator';
import { MemberRole } from '../../shared/enums/member.enum';

export class AddMemberDTO {
  @IsString()
  @IsDefined()
  user_id: string;

  @IsString()
  @IsDefined()
  board_id: string;

  @IsEnum(MemberRole)
  @IsDefined()
  role: string;
}
