import { IsDefined, IsNumber, IsString } from 'class-validator';
export class AddScoreDTO {
  @IsString()
  @IsDefined()
  username: string;

  @IsNumber()
  @IsDefined()
  score: number;

  @IsString()
  @IsDefined()
  user_id: string;
}
