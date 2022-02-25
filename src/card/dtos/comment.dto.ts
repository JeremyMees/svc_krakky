import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CommentDTO {
  @IsString()
  @IsDefined()
  user_id: string;

  @IsNumber()
  @IsDefined()
  created_at: number;

  @IsNumber()
  @IsDefined()
  updated_at: number;

  @IsString()
  @IsDefined()
  content: string;
}
