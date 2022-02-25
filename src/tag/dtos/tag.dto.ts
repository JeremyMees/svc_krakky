import { IsDefined, IsString, Length } from 'class-validator';

export class TagDTO {
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
}
