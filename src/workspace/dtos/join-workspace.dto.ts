import { IsDefined, IsString } from 'class-validator';

export class JoinWorkspaceDTO {
  @IsString()
  @IsDefined()
  user_id: string;

  @IsString()
  @IsDefined()
  workspace_id: string;

  @IsString()
  @IsDefined()
  token: string;
}
