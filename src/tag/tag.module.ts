import { forwardRef, Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './services/tag/tag.service';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { CardModule } from 'src/card/card.module';

@Module({
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
  imports: [forwardRef(() => DashboardModule), forwardRef(() => CardModule)],
})
export class TagModule {}
