import { IsDefined, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class JoinWorkspaceDTO {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  user_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  workspace_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  token: string;
}
