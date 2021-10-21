import { IsEnum, IsString } from 'class-validator';
import { MemberRole } from '../enums/member.enum';

export class MemberDTO {
  @IsString()
  _id: string;

  @IsEnum(MemberRole)
  role: string;
}
