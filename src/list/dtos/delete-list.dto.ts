import { IsDefined, IsString } from 'class-validator';

export class DeleteListDTO {
  @IsString()
  @IsDefined()
  board_id: string;

  @IsString()
  @IsDefined()
  _id: string;
}
