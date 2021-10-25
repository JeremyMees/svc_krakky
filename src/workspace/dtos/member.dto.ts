import { IsDefined, IsEnum, IsString } from 'class-validator';
import { MemberRole } from '../../shared/enums/member.enum';
import { ApiProperty } from '@nestjs/swagger';
export class MemberDTO {
  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  _id: string;

  @ApiProperty({ required: true, enum: MemberRole })
  @IsEnum(MemberRole)
  @IsDefined()
  role: string;
}
