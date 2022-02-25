import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MemberDTO } from 'src/workspace/dtos/member.dto';
import { TagDTO } from 'src/tag/dtos/tag.dto';
export class AddDashboardDTO {
  @IsString()
  @IsDefined()
  @Length(1, 20)
  title: string;

  @IsString()
  @IsDefined()
  workspace_id: string;

  @IsString()
  @IsDefined()
  created_by: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDTO)
  team: Array<MemberDTO>;

  @IsDefined()
  @IsBoolean()
  private: boolean;

  @IsDefined()
  @IsBoolean()
  inactive: boolean;

  @IsString()
  @IsDefined()
  color: string;

  @IsString()
  @IsDefined()
  bg_color: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDTO)
  recent_tags: Array<TagDTO>;
}
