import { IsDefined, IsOptional, IsString } from 'class-validator';

export class UpdateUserImgDTO {
  @IsString()
  @IsDefined()
  _id: string;

  @IsString()
  @IsDefined()
  img: string;

  @IsString()
  @IsOptional()
  img_query: string;
}
