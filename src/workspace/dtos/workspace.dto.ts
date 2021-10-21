import { IsArray, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberDTO } from './member.dto';

export class WorkspaceDTO {
  @IsString()
  created_by: string;

  @IsString()
  @Length(4, 20)
  workspace: string;

  @IsArray()
  @Type(() => MemberDTO)
  team: Array<MemberDTO>;
}
