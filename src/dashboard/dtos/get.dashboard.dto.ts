import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetOrDeleteDashboardDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  board_id: string;
}
