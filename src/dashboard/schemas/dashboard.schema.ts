import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Tag } from 'src/tag/schema/tag.schema';
import { Member } from 'src/workspace/schemas/member.schema';

export type DashboardDocument = Dashboard & Document;

@Schema()
export class Dashboard {
  @Prop({ required: true })
  created_by: string;

  @Prop({ required: false })
  created_at: number;

  @Prop({ required: false })
  updated_at: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  board_id: string;

  @Prop({ required: true })
  workspace_id: string;

  @Prop({ required: true })
  team: Array<Member>;

  @Prop({ required: true })
  private: boolean;

  @Prop({ required: true })
  inactive: boolean;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  bg_color: string;

  @Prop({ required: false })
  recent_tags: Array<Tag>;
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
