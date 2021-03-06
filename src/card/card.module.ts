import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from 'src/card/schemas/card.schema';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { ListModule } from 'src/list/list.module';
import { UserModule } from 'src/users/users.module';
import { CardController } from './card.controller';
import { CardService } from './services/card.service';

@Module({
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
  imports: [
    forwardRef(() => ListModule),
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
  ],
})
export class CardModule {}
