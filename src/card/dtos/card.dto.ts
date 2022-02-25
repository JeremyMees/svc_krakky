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
import { Type } from 'class-transformer';
import { CommentDTO } from './comment.dto';
import { TagDTO } from '../../tag/dtos/tag.dto';
export class CardDTO {
  @IsString()
  @IsDefined()
  board_id: string;

  @IsString()
  @IsDefined()
  @Length(1, 20)
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsDefined()
  list_id: string;

  @IsString()
  @IsDefined()
  created_by: string;

  @IsString()
  @IsDefined()
  created_at: number;

  @IsNumber()
  @IsDefined()
  index: number;

  @IsString()
  @IsDefined()
  color: string;

  @IsString()
  @IsOptional()
  priority: string;

  @IsString()
  @IsDefined()
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
