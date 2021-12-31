import { IsArray, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssigneeDTO } from './assignee.dto';
import { Type } from 'class-transformer';

export class GetAssigneesDTO {
  @ApiProperty({ required: true })
  @IsDefined()
  @IsArray()
  @Type(() => AssigneeDTO)
  assignees: Array<AssigneeDTO>;
}
