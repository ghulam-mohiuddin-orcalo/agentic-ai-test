import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, CreateApiKeyDto, ChangePasswordDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  async getMe(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(userId, dto);
  }

  @Put('me/password')
  @ApiOperation({ summary: 'Change password' })
  async changePassword(@CurrentUser('id') userId: string, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(userId, dto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete account' })
  async deleteAccount(@CurrentUser('id') userId: string) {
    return this.usersService.deleteAccount(userId);
  }

  // --- API Keys ---

  @Post('me/api-keys')
  @ApiOperation({ summary: 'Create a new API key' })
  async createApiKey(@CurrentUser('id') userId: string, @Body() dto: CreateApiKeyDto) {
    return this.usersService.createApiKey(userId, dto);
  }

  @Get('me/api-keys')
  @ApiOperation({ summary: 'List all API keys' })
  async listApiKeys(@CurrentUser('id') userId: string) {
    return this.usersService.listApiKeys(userId);
  }

  @Delete('me/api-keys/:keyId')
  @ApiOperation({ summary: 'Delete an API key' })
  async deleteApiKey(@CurrentUser('id') userId: string, @Param('keyId') keyId: string) {
    return this.usersService.deleteApiKey(userId, keyId);
  }
}
