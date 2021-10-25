import { IsDefined, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class DashboardDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  board_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  @Length(1, 20)
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  workspace: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  created_by: string;
}
