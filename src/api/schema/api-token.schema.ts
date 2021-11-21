import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApiTokenDocument = ApiToken & Document;

@Schema()
export class ApiToken {
  @Prop({ required: true, unique: true })
  user_id: string;

  @Prop({ required: true })
  token: string;
}

export const ApiTokenSchema = SchemaFactory.createForClass(ApiToken);
