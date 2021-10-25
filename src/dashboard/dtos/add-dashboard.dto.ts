import { IsDefined, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddDashboardDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
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
  workspace_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  created_by: string;
}
