import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessons: LessonsService) {}

  @Get()
  list(@Query('gradeMin') gradeMin?: string, @Query('gradeMax') gradeMax?: string, @Query('difficulty') difficulty?: string) {
    return this.lessons.list({
      gradeMin: gradeMin ? Number(gradeMin) : undefined,
      gradeMax: gradeMax ? Number(gradeMax) : undefined,
      difficulty: difficulty || undefined,
    });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.lessons.get(id);
  }

  @Post('admin/upsert')
  @UseGuards(AuthGuard('jwt'))
  upsert(@Req() req: any, @Body() topic: any) {
    // In real app, check ADMIN role from req.user
    return this.lessons.upsert(topic);
  }
}