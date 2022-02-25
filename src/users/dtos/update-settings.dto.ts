import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class UpdateUserSettingsDTO {
  @IsString()
  @IsDefined()
  _id: string;

  @IsBoolean()
  @IsOptional()
  marketing: boolean;
}
