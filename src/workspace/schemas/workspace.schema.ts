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
  team: Array<Member>;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
