import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { AuthGuard } from '@nestjs/passport';
import { AccountType } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  async me(@Req() req: any) {
    return req.user;
  }

  @Get('me/profile')
  async getMyProfile(@Req() req: any) {
    const userId = req.user.sub;
    const user = await this.users.upsertFromAuth0(req.user.sub, req.user.email ?? null, req.user.name ?? 'User');
    return this.users.getProfile(user.id);
  }

  @Patch('me/profile')
  async updateMyProfile(@Req() req: any, @Body() body: any) {
    const user = await this.users.upsertFromAuth0(req.user.sub, req.user.email ?? null, req.user.name ?? 'User');
    return this.users.updateProfile(user.id, body);
  }

  @Post(':childId/link-parent/:parentId')
  async linkChild(@Param('childId') childId: string, @Param('parentId') parentId: string) {
    return this.users.linkChildToParent(childId, parentId);
  }

  @Post(':userId/account-type')
  async setType(@Param('userId') userId: string, @Body('type') type: AccountType) {
    return this.users.setAccountType(userId, type);
  }
}