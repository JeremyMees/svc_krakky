import { IsDefined, IsString } from 'class-validator';

export class AssigneeDTO {
  @IsString()
  @IsDefined()
  _id: string;
}
