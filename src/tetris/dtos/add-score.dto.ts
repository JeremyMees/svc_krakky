import { IsDefined, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddScoreDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  username: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsDefined()
  score: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  user_id: string;
}
