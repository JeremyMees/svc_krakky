import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssigneeDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  _id: string;
}
