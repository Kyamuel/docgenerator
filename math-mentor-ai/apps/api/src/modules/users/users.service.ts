import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AccountType } from '@prisma/client';
import { SubscriptionService } from '../subscription/subscription.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertFromAuth0(auth0Sub: string, email: string | null, displayName: string) {
    return this.prisma.user.upsert({
      where: { auth0Sub },
      create: { auth0Sub, email: email || undefined, displayName, accountType: 'CHILD' },
      update: { email: email || undefined, displayName },
    });
  }

  async getProfile(userId: string) {
    return this.prisma.profile.findUnique({ where: { userId } });
  }

  async updateProfile(userId: string, data: { gradeLevel?: number; country?: string; timezone?: string; preferences?: any }) {
    return this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  async linkChildToParent(childId: string, parentId: string) {
    const child = await this.prisma.user.findUnique({ where: { id: childId } });
    const parent = await this.prisma.user.findUnique({ where: { id: parentId }, include: { children: true, subscription: true } });
    if (!child || !parent) throw new NotFoundException('User not found');
    if (parent.accountType !== AccountType.PARENT) throw new NotFoundException('Parent not found');

    const plan = parent.subscription?.plan || 'FREE';
    if (plan !== 'FAMILY' && parent.children.length >= 0) {
      throw new ForbiddenException('Only Family plan can link child accounts.');
    }
    if (plan === 'FAMILY' && parent.children.length >= 6) {
      throw new ForbiddenException('Family plan allows up to 6 child accounts.');
    }

    return this.prisma.user.update({ where: { id: childId }, data: { parentId } });
  }

  async setAccountType(userId: string, type: AccountType) {
    return this.prisma.user.update({ where: { id: userId }, data: { accountType: type } });
  }
}