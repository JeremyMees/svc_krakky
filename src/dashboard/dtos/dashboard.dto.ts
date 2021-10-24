import { IsDefined, IsString, Length } from 'class-validator';

export class DashboardDTO {
  @IsString()
  @IsDefined()
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
  created_by: string;
}
