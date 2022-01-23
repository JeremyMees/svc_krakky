import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScoreDocument = Score & Document;

@Schema()
export class Score {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  user_id: string;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
