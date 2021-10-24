import { IsDefined, IsNumber, IsString, Length } from 'class-validator';

export class ListDTO {
  @IsString()
  @IsDefined()
  board_id: string;

  @IsString()
  @IsDefined()
  @Length(1, 20)
  title: string;

  @IsNumber()
  @IsDefined()
  index: number;
}
