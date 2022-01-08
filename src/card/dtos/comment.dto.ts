import { IsDefined, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  user_id: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsDefined()
  created_at: number;

  @IsNumber()
  @IsDefined()
  updated_at: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  content: string;
}
