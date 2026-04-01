import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto, CreateApiKeyDto, ChangePasswordDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(userId: string, dto: UpdateUserDto) {
    await this.findById(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        preferences: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password updated successfully' };
  }

  async deleteAccount(userId: string) {
    await this.findById(userId);

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account deleted successfully' };
  }

  // --- API Key Management ---

  async createApiKey(userId: string, dto: CreateApiKeyDto) {
    const rawKey = `nxai_${randomBytes(32).toString('hex')}`;
    const hashedKey = await bcrypt.hash(rawKey, 10);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        userId,
        key: hashedKey,
        name: dto.name,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    // Return raw key only once — user must save it
    return { ...apiKey, key: rawKey };
  }

  async listApiKeys(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        lastUsed: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteApiKey(userId: string, keyId: string) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id: keyId },
    });

    if (!apiKey || apiKey.userId !== userId) {
      throw new NotFoundException('API key not found');
    }

    await this.prisma.apiKey.delete({
      where: { id: keyId },
    });

    return { message: 'API key deleted successfully' };
  }
}
