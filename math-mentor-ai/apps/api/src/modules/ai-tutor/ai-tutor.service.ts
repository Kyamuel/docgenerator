import { Injectable, ForbiddenException } from '@nestjs/common';
import axios from 'axios';
import Redis from 'ioredis';
const RedisClient = (Redis as any).default || (Redis as any);

import { SubscriptionService } from '../subscription/subscription.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

const redis = process.env.REDIS_URL ? new (RedisClient as any)(process.env.REDIS_URL) : new (RedisClient as any)();

@Injectable()
export class AiTutorService {
  constructor(private readonly subs: SubscriptionService, private readonly prisma: PrismaService) {}

  private usageKey(userId: string) {
    const today = new Date().toISOString().slice(0, 10);
    return `usage:${userId}:${today}`;
  }

  async checkAndIncrementUsage(userId: string, plan: string) {
    const limits = this.subs.limitsFor(plan);
    if (limits.problemsPerDay === Infinity) return;

    const key = this.usageKey(userId);
    const used = parseInt((await redis.get(key)) || '0', 10);
    if (used >= limits.problemsPerDay) throw new ForbiddenException('Daily problem limit reached for your plan.');
    const ttl = await redis.ttl(key);
    const expireSeconds = ttl > 0 ? ttl : 60 * 60 * 24;
    await redis.multi().incr(key).expire(key, expireSeconds).exec();
  }

  async solve(userId: string, input: { problem: string; mode?: 'standard' | 'socratic'; difficulty?: string; topicId?: string }) {
    const plan = await this.subs.getUserPlan(userId);
    const limits = this.subs.limitsFor(plan);
    if (input.mode === 'socratic' && !limits.socratic) {
      throw new ForbiddenException('Socratic mode is available on Premium or Family plans.');
    }
    if ((input.difficulty === 'UNIVERSITY') && !limits.university) {
      throw new ForbiddenException('University difficulty is available on Premium or Family plans.');
    }

    await this.checkAndIncrementUsage(userId, plan);

    const url = process.env.MATH_SERVICE_URL || 'http://localhost:8000';
    const { data } = await axios.post(`${url}/solve`, {
      problem: input.problem,
      mode: input.mode ?? 'standard',
      difficulty: input.difficulty ?? 'BEGINNER',
    });

    // Persist attempt
    await this.prisma.attempt.create({
      data: {
        userId,
        input: input.problem,
        result: JSON.stringify(data),
        correct: data.correct ?? false,
        score: data.score ?? 0,
        topicId: input.topicId,
      },
    });

    return data;
  }
}