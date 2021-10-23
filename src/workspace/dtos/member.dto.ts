import { IsDefined, IsEnum, IsString } from 'class-validator';
import { MemberRole } from '../enums/member.enum';

export class MemberDTO {
  @IsString()
  @IsDefined()
  _id: string;

  @IsEnum(MemberRole)
  @IsDefined()
  role: string;
}