import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import Stripe from 'stripe';
import axios from 'axios';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' }) : null;

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserPlan(userId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    return sub?.plan ?? 'FREE';
  }

  async upsertPlan(userId: string, plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'FAMILY', provider: 'stripe' | 'mpesa', providerRef?: string, currency: string = 'USD') {
    return this.prisma.subscription.upsert({
      where: { userId },
      create: { userId, plan, provider, providerRef, currency, status: 'active' },
      update: { plan, provider, providerRef, currency, status: 'active' },
    });
  }

  limitsFor(plan: string) {
    switch (plan) {
      case 'FREE':
        return { problemsPerDay: 5, k12: true, university: false, socratic: false };
      case 'BASIC':
        return { problemsPerDay: Infinity, k12: true, university: false, socratic: false };
      case 'PREMIUM':
        return { problemsPerDay: Infinity, k12: true, university: true, socratic: true };
      case 'FAMILY':
        return { problemsPerDay: Infinity, k12: true, university: true, socratic: true };
      default:
        return { problemsPerDay: 5, k12: true, university: false, socratic: false };
    }
  }

  async createStripeCheckout(userId: string, priceId: string, successUrl: string, cancelUrl: string) {
    if (!stripe) throw new Error('Stripe not configured');
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
    });
    return { url: session.url };
  }

  async mpesaInitiate(userId: string, amount: number, phoneNumber: string) {
    // Placeholder: integrate Safaricom Daraja API Lipa na M-Pesa Online
    // Return a mock URL or confirmation for now
    return { status: 'initiated', reference: `MPESA-${Date.now()}`, amount, phoneNumber };
  }
}