import { IsDefined, IsEnum, IsString } from 'class-validator';
import { MemberRole } from '../../shared/enums/member.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  user_id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  board_id: string;

  @ApiProperty({ required: true, enum: MemberRole })
  @IsEnum(MemberRole)
  @IsDefined()
  role: string;
}
