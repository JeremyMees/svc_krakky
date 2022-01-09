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
export class UpdateDashboardDTO {
  @ApiProperty({ required: true })
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
}
