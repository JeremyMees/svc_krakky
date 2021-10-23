import { IsDefined, IsString } from 'class-validator';

export class CreateJoinWorkspaceTokenDTO {
  @IsString()
  @IsDefined()
  workspace_id: string;

  @IsString()
  @IsDefined()
  user_id: string;
}
