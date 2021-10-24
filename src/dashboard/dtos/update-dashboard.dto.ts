import { IsDefined, IsString, Length } from 'class-validator';

export class UpdateDashboardDTO {
  @IsString()
  @IsDefined()
  @Length(1, 20)
  title: string;

  @IsString()
  @IsDefined()
  board_id: string;
}
