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
import { CommentDTO } from './comment.dto';
import { Type } from 'class-transformer';
import { TagDTO } from '../../tag/dtos/tag.dto';
export class AddCardDTO {
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

  @IsEnum(Colors)
  @IsOptional()
  color: string;

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
