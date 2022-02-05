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
import { CommentDTO } from './comment.dto';
import { Type } from 'class-transformer';
import { TagDTO } from '../../tag/dtos/tag.dto';
export class AddCardDTO {
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

  @ApiProperty({ required: false, enum: Colors })
  @IsEnum(Colors)
  @IsOptional()
  color: string;

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
