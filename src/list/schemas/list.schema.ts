import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ListDocument = List & Document;

@Schema()
export class List {
  @Prop({ required: true })
  board_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  index: number;
}

export const ListSchema = SchemaFactory.createForClass(List);
