import { IsArray, IsDefined, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MemberDTO } from './member.dto';

export class UpdateMemberDTO {
  @IsString()
  @IsDefined()
  workspace_id: string;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MemberDTO)
  team: Array<MemberDTO>;
}
