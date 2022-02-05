import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Comment } from './comment.schema';
import { Tag } from '../../tag/schema/tag.schema';

export type CardDocument = Card & Document;

@Schema()
export class Card {
  @Prop({ required: true })
  board_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  content: string;

  @Prop({ required: true })
  list_id: string;

  @Prop({ required: true })
  created_by: string;

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true })
  updated_at: number;

  @Prop({ required: true })
  index: number;

  @Prop({ required: true })
  color: string;

  @Prop({ required: false })
  priority: string;

  @Prop({ required: true })
  assignees: Array<string>;

  @Prop({ required: false })
  start_date: Date;

  @Prop({ required: false })
  due_date: Date;

  @Prop({ required: false })
  completion_date: Date;

  @Prop({ required: false })
  comments: Array<Comment>;

  @Prop({ required: false })
  tags: Array<Tag>;
}

export const CardSchema = SchemaFactory.createForClass(Card);
