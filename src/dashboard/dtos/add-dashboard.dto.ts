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
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  board_id: string;

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

  @ApiProperty({ required: false })
  @IsDefined()
  @IsBoolean()
  private: boolean;
}
