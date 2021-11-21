import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiTokenDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  user_id: string;
}
