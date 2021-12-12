import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IfMemberDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  user_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  board_id: string;
}
