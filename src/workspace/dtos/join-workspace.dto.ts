import { IsDefined, IsEmail, IsString } from 'class-validator';
export class JoinWorkspaceDTO {
  @IsEmail()
  @IsDefined()
  email: string;

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
