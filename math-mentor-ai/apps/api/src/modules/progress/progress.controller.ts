import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('progress')
@UseGuards(AuthGuard('jwt'))
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Get('summary')
  async summary(@Req() req: any) {
    const userId = (await this.ensureUserId(req)).id;
    return this.progress.getUserSummary(userId);
  }

  @Get('mastery')
  async mastery(@Req() req: any) {
    const userId = (await this.ensureUserId(req)).id;
    return this.progress.getMastery(userId);
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