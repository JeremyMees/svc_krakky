import { IsDefined, IsString } from 'class-validator';

export class DeleteCardDTO {
  @IsString()
  @IsDefined()
  _id: string;

  @IsString()
  @IsDefined()
  board_id: string;
}
