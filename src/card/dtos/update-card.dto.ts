import {
  IsArray,
  IsDate,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Colors } from '../../shared/enums/color.enum';
import { Type } from 'class-transformer';
import { CommentDTO } from './comment.dto';
import { TagDTO } from '../../tag/dtos/tag.dto';

export class UpdateCardDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  board_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  _id: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  list_id: string;

  @ApiProperty({ required: false, enum: Colors })
  @IsEnum(Colors)
  @IsOptional()
  color: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  priority: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
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
