import { Module } from '@nestjs/common';
import { TetrisController } from './tetris.controller';
import { TetrisService } from './services/tetris.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Score, ScoreSchema } from './schemas/score.schema';

@Module({
  controllers: [TetrisController],
  providers: [TetrisService],
  imports: [
    MongooseModule.forFeature([{ name: Score.name, schema: ScoreSchema }]),
  ],
})
export class TetrisModule {}
