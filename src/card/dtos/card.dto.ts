import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

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
  created_at: string;

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
}
