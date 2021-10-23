import {
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MemberDTO } from './member.dto';

export class WorkspaceDTO {
  @IsString()
  @IsDefined()
  created_by: string;

  @IsString()
  @IsDefined()
  @Length(4, 20)
  workspace: string;

  @IsOptional()
  @IsArray()
  @Type(() => MemberDTO)
  team: Array<MemberDTO>;
}
