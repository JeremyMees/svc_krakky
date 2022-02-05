import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MemberDTO } from 'src/workspace/dtos/member.dto';
import { TagDTO } from 'src/tag/dtos/tag.dto';
export class UpdateDashboardDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  board_id: string;

  @ApiProperty({ required: false, default: [], isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDTO)
  team: Array<MemberDTO>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  private: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  inactive: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  color: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bg_color: string;

  @ApiProperty({ required: false, default: [], isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDTO)
  recent_tags: Array<TagDTO>;
}
