import { IsDefined, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ResetPasswordDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  @Length(6, 20)
  password: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  user_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  token: string;
}
