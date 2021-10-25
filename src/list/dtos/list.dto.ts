import { IsDefined, IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ListDTO {
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
  @IsNumber()
  @IsDefined()
  index: number;
}
