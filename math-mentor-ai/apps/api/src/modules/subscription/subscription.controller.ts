import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('subscription')
@UseGuards(AuthGuard('jwt'))
export class SubscriptionController {
  constructor(private readonly subs: SubscriptionService) {}

  @Get('plan')
  async getPlan(@Req() req: any) {
    const userId = (await this.ensureUserId(req)).id;
    const plan = await this.subs.getUserPlan(userId);
    return { plan, limits: this.subs.limitsFor(plan) };
  }

  @Post('stripe/checkout')
  async stripeCheckout(@Req() req: any, @Body() body: { priceId: string; successUrl: string; cancelUrl: string }) {
    const userId = (await this.ensureUserId(req)).id;
    return this.subs.createStripeCheckout(userId, body.priceId, body.successUrl, body.cancelUrl);
  }

  @Post('mpesa/initiate')
  async mpesa(@Req() req: any, @Body() body: { amount: number; phoneNumber: string }) {
    const userId = (await this.ensureUserId(req)).id;
    return this.subs.mpesaInitiate(userId, body.amount, body.phoneNumber);
  }

  private async ensureUserId(req: any) {
    // Use auth0 sub to upsert and return user
    const { sub, email, name } = req.user;
    const usersService = (await import('../users/users.service.js')).UsersService;
    const prisma = (await import('../prisma/prisma.service.js')).PrismaService;
    const tempUsers = new usersService(new prisma());
    const user = await tempUsers.upsertFromAuth0(sub, email ?? null, name ?? 'User');
    return user;
  }
}