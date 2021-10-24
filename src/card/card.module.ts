import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from 'src/card/schemas/card.schema';
import { ListModule } from 'src/list/list.module';
import { CardController } from './card.controller';
import { CardService } from './services/card.service';

@Module({
  providers: [CardService],
  controllers: [CardController],
  imports: [
    ListModule,
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
  ],
})
export class CardModule {}
