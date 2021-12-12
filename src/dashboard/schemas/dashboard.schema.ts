import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Member } from 'src/workspace/schemas/member.schema';

export type DashboardDocument = Dashboard & Document;

@Schema()
export class Dashboard {
  @Prop({ required: true })
  created_by: string;

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
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
