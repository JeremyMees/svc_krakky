import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MemberDTO } from 'src/workspace/dtos/member.dto';
export class AddDashboardDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  @Length(1, 20)
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  workspace_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  created_by: string;

  @ApiProperty({ required: false, default: [], isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => MemberDTO)
  team: Array<MemberDTO>;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsBoolean()
  private: boolean;

  @ApiProperty({ required: true })
  @IsDefined()
  @IsBoolean()
  inactive: boolean;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  color: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  bg_color: string;
}
