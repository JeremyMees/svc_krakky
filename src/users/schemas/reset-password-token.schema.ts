import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResetPasswordDocument = ResetPassword & Document;

@Schema()
export class ResetPassword {
  @Prop({ required: true, unique: true })
  user_id: string;
  @Prop({ required: true })
  resetPasswordToken: string;
  @Prop({ required: true })
  expire: string;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);
