import { IsDefined, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TagDTO {
  @ApiProperty({ required: true })
  @IsString()
  @Length(1, 10)
  @IsDefined()
  description: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  color: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  bg_color: string;
}
