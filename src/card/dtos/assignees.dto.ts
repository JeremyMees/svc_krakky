import { IsArray, IsDefined, ValidateNested } from 'class-validator';
import { AssigneeDTO } from './assignee.dto';
import { Type } from 'class-transformer';

export class GetAssigneesDTO {
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssigneeDTO)
  assignees: Array<AssigneeDTO>;
}
