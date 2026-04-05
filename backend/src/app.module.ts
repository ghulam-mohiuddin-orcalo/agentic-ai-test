import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ModelsModule } from './modules/models/models.module';
import { ChatModule } from './modules/chat/chat.module';
import { AgentsModule } from './modules/agents/agents.module';
import { UsageModule } from './modules/usage/usage.module';
import { HealthModule } from './modules/health/health.module';
import { WorkflowModule } from './modules/workflow/workflow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ModelsModule,
    ChatModule,
    AgentsModule,
    UsageModule,
    HealthModule,
    WorkflowModule,
  ],
})
export class AppModule {}
