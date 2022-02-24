import { IsDefined, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WorkspaceJoinMailDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  token: string;

  @ApiProperty({ required: true })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  workspace_id: string;
}
