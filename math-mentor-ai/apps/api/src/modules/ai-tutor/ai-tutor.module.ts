import { Module } from '@nestjs/common';
import { AiTutorController } from './ai-tutor.controller.js';
import { AiTutorService } from './ai-tutor.service.js';
import { SubscriptionModule } from '../subscription/subscription.module.js';

@Module({
  imports: [SubscriptionModule],
  controllers: [AiTutorController],
  providers: [AiTutorService],
})
export class AiTutorModule {}