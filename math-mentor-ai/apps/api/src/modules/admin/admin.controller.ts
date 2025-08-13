import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  @Get('health')
  health() {
    return { status: 'ok', time: new Date().toISOString() };
  }
}