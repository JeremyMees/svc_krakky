import { IsDefined, IsEmail, IsString } from 'class-validator';

export class WorkspaceJoinMailDTO {
  @IsString()
  @IsDefined()
  token: string;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  workspace_id: string;
}
