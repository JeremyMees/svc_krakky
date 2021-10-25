import { IsDefined, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class EmailDTO {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsDefined()
  email: string;
}
