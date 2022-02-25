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
export class UpdateDashboardDTO {
  @IsString()
  @IsOptional()
  @Length(1, 20)
  title: string;

  @IsString()
  @IsDefined()
  board_id: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDTO)
  team: Array<MemberDTO>;

  @IsOptional()
  @IsBoolean()
  private: boolean;

  @IsOptional()
  @IsBoolean()
  inactive: boolean;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  @IsOptional()
  bg_color: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDTO)
  recent_tags: Array<TagDTO>;
}
