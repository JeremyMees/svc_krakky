import { IsDefined, IsEmail, IsString } from 'class-validator';
export class CreateJoinWorkspaceTokenDTO {
  @IsString()
  @IsDefined()
  workspace_id: string;

  @IsEmail()
  @IsDefined()
  email: string;
}
