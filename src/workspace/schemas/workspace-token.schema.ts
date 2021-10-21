import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkspaceTokenDocument = WorkspaceToken & Document;

@Schema()
export class WorkspaceToken {
  @Prop({ required: true, unique: true })
  joinToken: string;
  @Prop({ required: true })
  expire: string;
}

export const WorkspaceTokenSchema =
  SchemaFactory.createForClass(WorkspaceToken);
