import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserSummary(userId: string) {
    const attempts = await this.prisma.attempt.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 100 });
    const correct = attempts.filter(a => a.correct).length;
    const total = attempts.length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    return { accuracy, totalAttempts: total, recent: attempts };
  }

  async getMastery(userId: string) {
    const progress = await this.prisma.progress.findMany({ where: { userId }, include: { topic: true } });
    return progress.map(p => ({ topicId: p.topicId, title: p.topic.title, mastery: p.masteryScore, streak: p.streak }));
  }
}