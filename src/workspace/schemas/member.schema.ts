import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Member {
  @Prop({ required: true })
  _id: string;
  @Prop({ required: true })
  role: string;
}
