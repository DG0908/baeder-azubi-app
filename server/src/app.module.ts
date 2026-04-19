import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CommonModule } from './common/common.module';
import { envValidationSchema } from './common/config/env.validation';
import { ApprovedGuard } from './common/guards/approved.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { ContentModule } from './modules/content/content.module';
import { DuelsModule } from './modules/duels/duels.module';
import { ExamSimulatorModule } from './modules/exam-simulator/exam-simulator.module';
import { FeatureRolloutModule } from './modules/feature-rollout/feature-rollout.module';
import { FlashcardsModule } from './modules/flashcards/flashcards.module';
import { ForumModule } from './modules/forum/forum.module';
import { HealthModule } from './modules/health/health.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { QuestionWorkflowsModule } from './modules/question-workflows/question-workflows.module';
import { SchoolAttendanceModule } from './modules/school-attendance/school-attendance.module';
import { ExamGradesModule } from './modules/exam-grades/exam-grades.module';
import { ReportBooksModule } from './modules/report-books/report-books.module';
import { SwimSessionsModule } from './modules/swim-sessions/swim-sessions.module';
import { SwimTrainingPlansModule } from './modules/swim-training-plans/swim-training-plans.module';
import { UserStatsModule } from './modules/user-stats/user-stats.module';
import { BadgesModule } from './modules/badges/badges.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120
      }
    ]),
    ScheduleModule.forRoot(),
    PrismaModule,
    CommonModule,
    AppConfigModule,
    AuthModule,
    InvitationsModule,
    OrganizationsModule,
    UsersModule,
    ChatModule,
    ContentModule,
    FlashcardsModule,
    ForumModule,
    ExamSimulatorModule,
    FeatureRolloutModule,
    NotificationsModule,
    QuestionWorkflowsModule,
    SchoolAttendanceModule,
    ExamGradesModule,
    ReportBooksModule,
    SwimTrainingPlansModule,
    SwimSessionsModule,
    UserStatsModule,
    BadgesModule,
    DuelsModule,
    HealthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: ApprovedGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
