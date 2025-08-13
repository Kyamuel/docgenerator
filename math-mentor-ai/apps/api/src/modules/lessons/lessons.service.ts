import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  list(params: { gradeMin?: number; gradeMax?: number; difficulty?: string }) {
    const where: any = {};
    if (params.difficulty) where.difficulty = params.difficulty;
    if (typeof params.gradeMin === 'number') where.gradeMin = { gte: params.gradeMin };
    if (typeof params.gradeMax === 'number') where.gradeMax = { lte: params.gradeMax };
    return this.prisma.lessonTopic.findMany({ where, orderBy: { gradeMin: 'asc' } });
  }

  get(id: string) {
    return this.prisma.lessonTopic.findUnique({ where: { id } });
  }

  upsert(topic: { id?: string; title: string; gradeMin: number; gradeMax: number; difficulty: string; description: string; content: any }) {
    const { id, ...rest } = topic;
    const data: any = { ...rest, difficulty: rest.difficulty as any };
    if (id) return this.prisma.lessonTopic.update({ where: { id }, data });
    return this.prisma.lessonTopic.create({ data });
  }

  delete(id: string) {
    return this.prisma.lessonTopic.delete({ where: { id } });
  }
}