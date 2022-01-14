import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSettingsDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  _id: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  marketing: boolean;
}
