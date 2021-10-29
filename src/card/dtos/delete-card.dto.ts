import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCardDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  card_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  board_id: string;
}
