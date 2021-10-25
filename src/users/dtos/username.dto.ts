import { IsDefined, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UsernameDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  @Length(4, 12)
  username: string;
}
