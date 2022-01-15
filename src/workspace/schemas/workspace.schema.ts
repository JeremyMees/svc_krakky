import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Member } from './member.schema';

export type WorkspaceDocument = Workspace & Document;

@Schema()
export class Workspace {
  @Prop({ required: true })
  created_by: string;

  @Prop({ required: true })
  workspace: string;

  @Prop({ required: true })
  workspace_id: string;

  @Prop({ required: true })
  team: Array<Member>;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  bg_color: string;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
