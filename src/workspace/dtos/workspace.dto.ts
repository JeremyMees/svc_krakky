import {
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
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

  @IsString()
  @IsDefined()
  color: string;

  @IsString()
  @IsDefined()
  bg_color: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDTO)
  team: Array<MemberDTO>;
}
