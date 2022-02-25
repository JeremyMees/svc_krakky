import {
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MemberDTO } from 'src/workspace/dtos/member.dto';

export class UpdateMemberDTO {
  @IsString()
  @IsDefined()
  board_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDTO)
  team: Array<MemberDTO>;
}
