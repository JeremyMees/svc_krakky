import { IsDefined, IsString, Length } from 'class-validator';

export class AddTagDTO {
  @IsString()
  @Length(1, 10)
  @IsDefined()
  description: string;

  @IsString()
  @IsDefined()
  color: string;

  @IsString()
  @IsDefined()
  bg_color: string;

  @IsString()
  @IsDefined()
  card_id: string;

  @IsString()
  @IsDefined()
  board_id: string;
}
