import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetApiTokenDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  user_id: string;
}
