import {
  IsArray,
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CommentDTO } from './comment.dto';
import { TagDTO } from '../../tag/dtos/tag.dto';
export class CardDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  board_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  @Length(1, 20)
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  list_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  created_by: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  created_at: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsDefined()
  index: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  color: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  priority: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  assignees: Array<string>;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  start_date: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  due_date: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  completion_date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentDTO)
  comments: Array<CommentDTO>;

  @ApiProperty({ required: false, default: [] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDTO)
  tags: Array<TagDTO>;
}
