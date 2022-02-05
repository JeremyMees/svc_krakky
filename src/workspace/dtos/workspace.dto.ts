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
import { ApiProperty } from '@nestjs/swagger';
export class WorkspaceDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  created_by: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  @Length(4, 20)
  workspace: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  color: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  bg_color: string;

  @ApiProperty({ required: false, default: [], isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDTO)
  team: Array<MemberDTO>;
}
