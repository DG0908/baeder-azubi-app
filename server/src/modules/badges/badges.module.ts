import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { BadgesController } from './badges.controller';
import { BadgesService } from './badges.service';

@Module({
  imports: [CommonModule],
  controllers: [BadgesController],
  providers: [BadgesService],
  exports: [BadgesService]
})
export class BadgesModule {}
