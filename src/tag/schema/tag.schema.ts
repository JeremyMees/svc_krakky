import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema()
export class Tag {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  bg_color: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
