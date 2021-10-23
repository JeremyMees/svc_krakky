import { IsDefined, IsEmail } from 'class-validator';

export class EmailDTO {
  @IsEmail()
  @IsDefined()
  email: string;
}
