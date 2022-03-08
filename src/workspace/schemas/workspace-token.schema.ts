import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkspaceTokenDocument = WorkspaceToken & Document;

@Schema()
export class WorkspaceToken {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expire: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false, sparse: true })
  user_id: string;

  @Prop({ required: true })
  workspace_id: string;
}

export const WorkspaceTokenSchema =
  SchemaFactory.createForClass(WorkspaceToken);
