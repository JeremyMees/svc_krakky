import { IsDefined, IsString } from 'class-validator';

export class IfMemberDTO {
  @IsString()
  @IsDefined()
  user_id: string;

  @IsString()
  @IsDefined()
  workspace_id: string;
}
