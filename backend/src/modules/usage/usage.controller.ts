import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsageService } from './usage.service';
import { TrackUsageDto, UsageStatsDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Usage')
@ApiBearerAuth()
@Controller('usage')
@UseGuards(JwtAuthGuard)
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Post('track')
  @ApiOperation({ summary: 'Track usage (internal use)' })
  async track(@CurrentUser('id') userId: string, @Body() dto: TrackUsageDto) {
    return this.usageService.track(userId, dto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get usage statistics' })
  async getStats(@CurrentUser('id') userId: string, @Query() query: UsageStatsDto) {
    return this.usageService.getStats(userId, query);
  }

  @Get('by-model')
  @ApiOperation({ summary: 'Get usage grouped by model' })
  async getByModel(@CurrentUser('id') userId: string, @Query() query: UsageStatsDto) {
    return this.usageService.getByModel(userId, query);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get usage history' })
  async getHistory(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usageService.getHistory(userId, page || 1, limit || 50);
  }
}
