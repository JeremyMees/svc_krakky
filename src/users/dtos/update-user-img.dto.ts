import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserImgDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  _id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  img: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  img_query: string;
}
