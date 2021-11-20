import { IsArray, IsDefined, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MemberDTO } from './member.dto';

export class UpdateMemberDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  workspace_id: string;

  @ApiProperty({ required: true, default: [], isArray: true })
  @IsArray()
  @Type(() => MemberDTO)
  team: Array<MemberDTO>;
}
