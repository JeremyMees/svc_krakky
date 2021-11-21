import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteApiTokenDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  id: string;
}
