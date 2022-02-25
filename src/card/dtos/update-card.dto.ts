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
import { Colors } from '../../shared/enums/color.enum';
import { Type } from 'class-transformer';
import { CommentDTO } from './comment.dto';
import { TagDTO } from '../../tag/dtos/tag.dto';

export class UpdateCardDTO {
  @IsString()
  @IsDefined()
  board_id: string;

  @IsString()
  @IsDefined()
  _id: string;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  list_id: string;

  @IsEnum(Colors)
  @IsOptional()
  color: string;

  @IsString()
  @IsOptional()
  priority: string;

  @IsString()
  @IsOptional()
  assignees: Array<string>;

  @IsDate()
  @IsOptional()
  start_date: Date;

  @IsDate()
  @IsOptional()
  due_date: Date;

  @IsDate()
  @IsOptional()
  completion_date: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentDTO)
  comments: Array<CommentDTO>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagDTO)
  tags: Array<TagDTO>;
}
