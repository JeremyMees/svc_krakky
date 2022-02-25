import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateListDTO {
  @IsString()
  @IsDefined()
  _id: string;

  @IsString()
  @IsDefined()
  board_id: string;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  title: string;

  @IsNumber()
  @IsOptional()
  index: number;
}
