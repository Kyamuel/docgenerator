import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiTutorService } from './ai-tutor.service.js';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiTutorController {
  constructor(private readonly ai: AiTutorService) {}

  @Post('solve')
  async solve(@Req() req: any, @Body() body: { problem: string; mode?: 'standard' | 'socratic'; difficulty?: string; topicId?: string }) {
    const userId = (await this.ensureUserId(req)).id;
    return this.ai.solve(userId, body);
  }

  private async ensureUserId(req: any) {
    const { sub, email, name } = req.user;
    const usersService = (await import('../users/users.service.js')).UsersService;
    const prisma = (await import('../prisma/prisma.service.js')).PrismaService;
    const tempUsers = new usersService(new prisma());
    const user = await tempUsers.upsertFromAuth0(sub, email ?? null, name ?? 'User');
    return user;
  }
}