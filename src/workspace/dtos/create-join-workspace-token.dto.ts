import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateJoinWorkspaceTokenDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  workspace_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  user_id: string;
}
