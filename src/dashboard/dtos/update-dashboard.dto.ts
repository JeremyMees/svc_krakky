import { IsDefined, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateDashboardDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  @Length(1, 20)
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  board_id: string;
}
