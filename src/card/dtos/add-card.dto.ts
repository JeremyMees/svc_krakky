import { IsDefined, IsOptional, IsString, Length } from 'class-validator';

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

  @IsString()
  @IsDefined()
  created_at: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  @IsOptional()
  priority: string;

  @IsString()
  @IsOptional()
  assignees: Array<string>;
}
