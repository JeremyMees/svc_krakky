import { IsDefined, IsString, Length } from 'class-validator';
export class AddListDTO {
  @IsString()
  @IsDefined()
  board_id: string;

  @IsString()
  @IsDefined()
  @Length(1, 20)
  title: string;
}
