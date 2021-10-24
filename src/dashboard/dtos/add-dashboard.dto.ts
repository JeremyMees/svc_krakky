import { IsDefined, IsOptional, IsString, Length } from 'class-validator';

export class AddDashboardDTO {
  @IsString()
  @IsOptional()
  board_id: string;

  @IsString()
  @IsDefined()
  @Length(1, 20)
  title: string;

  @IsString()
  @IsDefined()
  workspace: string;

  @IsString()
  @IsDefined()
  workspace_id: string;

  @IsString()
  @IsDefined()
  created_by: string;
}
