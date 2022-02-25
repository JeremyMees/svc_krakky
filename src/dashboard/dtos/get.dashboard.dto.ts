import { IsDefined, IsString } from 'class-validator';

export class GetOrDeleteDashboardDTO {
  @IsString()
  @IsDefined()
  board_id: string;
}
