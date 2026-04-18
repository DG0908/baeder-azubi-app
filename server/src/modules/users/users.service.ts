import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { AccountStatus, AppRole, ParentalConsentStatus, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { Request } from 'express';
import sanitizeHtml from 'sanitize-html';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ApproveUserDto } from './dto/approve-user.dto';
import { UpdateAvatarUnlocksDto } from './dto/update-avatar-unlocks.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { VerifyParentalConsentDto } from './dto/verify-parental-consent.dto';

const DSGVO_MINIMUM_AGE = 16;

const currentUserSelect = {
  id: true,
  email: true,
  displayName: true,
  avatar: true,
  company: true,
  birthDate: true,
  role: true,
  status: true,
  canSignReports: true,
  canViewSchoolCards: true,
  canViewExamGrades: true,
  organizationId: true,
  organization: {
    select: {
      id: true,
      name: true,
      slug: true
    }
  },
  trainingEnd: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  reportBookProfile: true,
  unlockedAvatarIds: true,
  parentalConsentStatus: true
} satisfies Prisma.UserSelect;

const adminUserSelect = {
  id: true,
  email: true,
  displayName: true,
  avatar: true,
  company: true,
  birthDate: true,
  role: true,
  status: true,
  canSignReports: true,
  canViewSchoolCards: true,
  canViewExamGrades: true,
  organizationId: true,
  organization: {
    select: {
      id: true,
      name: true,
      slug: true
    }
  },
  trainingEnd: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  approvedAt: true,
  unlockedAvatarIds: true,
  parentalConsentStatus: true,
  parentalConsentNote: true,
  parentalConsentVerifiedAt: true
} satisfies Prisma.UserSelect;

const exportRelatedUserSelect = {
  id: true,
  displayName: true,
  role: true
} satisfies Prisma.UserSelect;

const exportAccountSelect = {
  ...currentUserSelect,
  isDeleted: true
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService
  ) {}

  async getCurrentUser(actor: AuthenticatedUser) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: actor.id },
      select: currentUserSelect
    });
  }

  async updateCurrentUser(actor: AuthenticatedUser, dto: UpdateMyProfileDto, request: Request) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: actor.id }
    });

    if (!existingUser || existingUser.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    const data: Prisma.UserUpdateInput = {};
    const metadata: Record<string, unknown> = {};

    if (dto.displayName !== undefined) {
      const displayName = this.sanitizeText(dto.displayName, 120);
      if (displayName.length < 2) {
        throw new BadRequestException('Display name must be at least 2 characters long.');
      }

      data.displayName = displayName;
      metadata.previousDisplayName = existingUser.displayName;
      metadata.nextDisplayName = displayName;
    }

    if (dto.avatar !== undefined) {
      const avatar = dto.avatar === null ? null : this.normalizeAvatar(dto.avatar);
      data.avatar = avatar;
      metadata.previousAvatar = existingUser.avatar;
      metadata.nextAvatar = avatar;
    }

    if (dto.company !== undefined) {
      const company = dto.company === null ? null : this.sanitizeNullableText(dto.company, 160);
      data.company = company;
      metadata.previousCompany = existingUser.company;
      metadata.nextCompany = company;
    }

    if (dto.birthDate !== undefined) {
      const birthDate = dto.birthDate === null ? null : this.normalizeBirthDate(dto.birthDate);
      data.birthDate = birthDate;
      metadata.previousBirthDate = existingUser.birthDate?.toISOString() ?? null;
      metadata.nextBirthDate = birthDate?.toISOString() ?? null;

      if (birthDate && this.isUnderAge(birthDate)) {
        if (existingUser.parentalConsentStatus === ParentalConsentStatus.NOT_REQUIRED) {
          data.parentalConsentStatus = ParentalConsentStatus.PENDING;
          metadata.parentalConsentStatusChanged = 'NOT_REQUIRED → PENDING (under 16)';
        }
      } else if (existingUser.parentalConsentStatus === ParentalConsentStatus.PENDING) {
        data.parentalConsentStatus = ParentalConsentStatus.NOT_REQUIRED;
        metadata.parentalConsentStatusChanged = 'PENDING → NOT_REQUIRED (age corrected)';
      }
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No valid profile updates were provided.');
    }

    const updated = await this.prisma.user.update({
      where: { id: actor.id },
      data,
      select: currentUserSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.profile_updated',
      'user',
      actor.id,
      metadata as Prisma.InputJsonValue,
      request
    );

    return updated;
  }

  async listPendingUsers() {
    return this.prisma.user.findMany({
      where: {
        status: AccountStatus.PENDING,
        isDeleted: false
      },
      select: adminUserSelect,
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  async listAllUsers() {
    return this.prisma.user.findMany({
      where: {
        isDeleted: false
      },
      select: adminUserSelect,
      orderBy: [
        {
          status: 'asc'
        },
        {
          createdAt: 'desc'
        }
      ]
    });
  }

  async listOrganizationContacts(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      return [];
    }

    return this.prisma.user.findMany({
      where: {
        organizationId: actor.organizationId,
        status: AccountStatus.APPROVED,
        isDeleted: false,
        NOT: {
          id: actor.id
        }
      },
      select: {
        id: true,
        displayName: true,
        role: true,
        canSignReports: true,
        organizationId: true
      },
      orderBy: {
        displayName: 'asc'
      }
    });
  }

  async updateApproval(actor: AuthenticatedUser, userId: string, dto: ApproveUserDto, request: Request) {
    if (actor.id === userId && dto.status !== AccountStatus.APPROVED) {
      throw new BadRequestException('You cannot disable or reject your own account from this endpoint.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    if (user.role === AppRole.ADMIN && dto.status !== AccountStatus.APPROVED) {
      throw new ForbiddenException(
        'Disabling or rejecting administrator accounts requires a dedicated break-glass workflow.'
      );
    }

    if (
      dto.status === AccountStatus.APPROVED &&
      user.parentalConsentStatus === ParentalConsentStatus.PENDING
    ) {
      throw new BadRequestException(
        'Cannot approve: parental consent is still pending (DSGVO Art. 8). Verify consent first.'
      );
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: dto.status,
        approvedAt: dto.status === AccountStatus.APPROVED ? new Date() : null,
        approvedById: dto.status === AccountStatus.APPROVED ? actor.id : null,
        ...(dto.status === AccountStatus.APPROVED ? {} : { refreshTokenHash: null })
      },
      select: adminUserSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.approval_updated',
      'user',
      userId,
      {
        previousStatus: user.status,
        nextStatus: dto.status,
        reason: dto.reason ?? null
      },
      request
    );

    return updated;
  }

  async updateRole(actor: AuthenticatedUser, userId: string, dto: UpdateUserRoleDto, request: Request) {
    if (actor.id === userId) {
      throw new ForbiddenException('Use a separate break-glass workflow for self role changes.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    if (user.role === AppRole.ADMIN && dto.role !== AppRole.ADMIN) {
      throw new ForbiddenException('Downgrading administrator accounts requires a dedicated approval workflow.');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: dto.role
      },
      select: adminUserSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.role_updated',
      'user',
      userId,
      {
        previousRole: user.role,
        nextRole: dto.role
      },
      request
    );

    return updated;
  }

  async updateOrganization(
    actor: AuthenticatedUser,
    userId: string,
    organizationId: string | null,
    request: Request
  ) {
    if (actor.id === userId) {
      throw new ForbiddenException('Use a separate workflow for reassigning your own organization.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    if (organizationId) {
      const organization = await this.prisma.organization.findUnique({
        where: { id: organizationId }
      });

      if (!organization || !organization.isActive) {
        throw new BadRequestException('Organization is not active or does not exist.');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        organizationId
      },
      select: adminUserSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.organization_updated',
      'user',
      userId,
      {
        previousOrganizationId: user.organizationId,
        nextOrganizationId: organizationId
      },
      request
    );

    return updated;
  }

  async updatePermissions(
    actor: AuthenticatedUser,
    userId: string,
    dto: UpdateUserPermissionsDto,
    request: Request
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    const data: Prisma.UserUpdateInput = {};
    const metadata: Record<string, unknown> = {};

    if (dto.canSignReports !== undefined) {
      data.canSignReports = dto.canSignReports;
      metadata.canSignReports = dto.canSignReports;
    }
    if (dto.canViewSchoolCards !== undefined) {
      data.canViewSchoolCards = dto.canViewSchoolCards;
      metadata.canViewSchoolCards = dto.canViewSchoolCards;
    }
    if (dto.canViewExamGrades !== undefined) {
      data.canViewExamGrades = dto.canViewExamGrades;
      metadata.canViewExamGrades = dto.canViewExamGrades;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No permission updates were provided.');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: adminUserSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.permissions_updated',
      'user',
      userId,
      metadata as Prisma.InputJsonValue,
      request
    );

    return updated;
  }

  async adminResetPassword(
    actor: AuthenticatedUser,
    userId: string,
    newPassword: string,
    request: Request
  ) {
    if (actor.id === userId) {
      throw new ForbiddenException('Use the change-password endpoint for your own account.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    const passwordHash = await argon2.hash(newPassword);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          passwordHash,
          refreshTokenHash: null
        }
      });

      await tx.loginAttempt.deleteMany({
        where: { email: user.email }
      });

      await tx.passwordResetToken.deleteMany({
        where: { userId }
      });

      await tx.trustedDevice.deleteMany({
        where: { userId }
      });
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.password_reset_by_admin',
      'user',
      userId,
      {
        targetEmail: user.email,
        targetDisplayName: user.displayName
      },
      request
    );

    return {
      reset: true,
      requiresTotp: Boolean(user.totpEnabled)
    };
  }

  async exportUserData(actor: AuthenticatedUser, targetUserId: string, request: Request) {
    if (actor.id !== targetUserId && actor.role !== AppRole.ADMIN) {
      throw new ForbiddenException('You are not allowed to export this user.');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: exportAccountSelect
    });

    if (!targetUser || targetUser.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    const [
      stats,
      duels,
      duelAnswers,
      scheduledExamsCreated,
      examGrades,
      theoryExamSessions,
      theoryExamAttempts,
      practicalExamAttempts,
      submittedQuestions,
      questionReports,
      flashcards,
      reportBookEntries,
      schoolAttendanceEntries,
      swimSessions,
      swimTrainingPlans,
      forumPosts,
      forumReplies,
      sentChatMessages,
      receivedChatMessages,
      notifications,
      pushSubscriptions,
      xpEvents,
      auditLogs,
      learningMaterialsCreated,
      resourcesCreated,
      newsPostsCreated,
      badges
    ] = await Promise.all([
      this.prisma.userStats.findUnique({
        where: { userId: targetUserId }
      }),
      this.prisma.duel.findMany({
        where: {
          OR: [
            { challengerId: targetUserId },
            { opponentId: targetUserId }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          status: true,
          questionCount: true,
          gameState: true,
          expiresAt: true,
          startedAt: true,
          completedAt: true,
          createdAt: true,
          updatedAt: true,
          challengerId: true,
          opponentId: true,
          winnerUserId: true,
          challenger: {
            select: exportRelatedUserSelect
          },
          opponent: {
            select: exportRelatedUserSelect
          },
          winnerUser: {
            select: exportRelatedUserSelect
          }
        }
      }),
      this.prisma.duelAnswer.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          answeredAt: 'desc'
        },
        select: {
          id: true,
          duelId: true,
          duelQuestionId: true,
          selectedOptionIndex: true,
          isCorrect: true,
          durationMs: true,
          answeredAt: true
        }
      }),
      this.prisma.scheduledExam.findMany({
        where: {
          createdById: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.examGrade.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.theoryExamSession.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.theoryExamAttempt.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.practicalExamAttempt.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.submittedQuestion.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.questionReport.findMany({
        where: {
          reportedById: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.flashcard.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.reportBookEntry.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          weekStart: 'desc'
        }
      }),
      this.prisma.schoolAttendanceEntry.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          date: 'desc'
        }
      }),
      this.prisma.swimSession.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          date: 'desc'
        }
      }),
      this.prisma.swimTrainingPlan.findMany({
        where: {
          OR: [
            { assignedUserId: targetUserId },
            { createdById: targetUserId }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.forumPost.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.forumReply.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.chatMessage.findMany({
        where: {
          senderId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          scope: true,
          content: true,
          createdAt: true,
          recipientId: true,
          recipient: {
            select: exportRelatedUserSelect
          }
        }
      }),
      this.prisma.chatMessage.findMany({
        where: {
          recipientId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          scope: true,
          content: true,
          createdAt: true,
          senderId: true,
          sender: {
            select: exportRelatedUserSelect
          }
        }
      }),
      this.prisma.appNotification.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.pushSubscription.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          updatedAt: 'desc'
        },
        select: {
          id: true,
          endpoint: true,
          userAgent: true,
          deviceLabel: true,
          lastSeenAt: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      this.prisma.userXpEvent.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.auditLog.findMany({
        where: {
          actorUserId: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          metadata: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true
        }
      }),
      this.prisma.learningMaterial.findMany({
        where: {
          createdById: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.resource.findMany({
        where: {
          createdById: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.newsPost.findMany({
        where: {
          createdById: targetUserId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.userBadge.findMany({
        where: {
          userId: targetUserId
        },
        orderBy: {
          earnedAt: 'asc'
        },
        select: {
          id: true,
          badgeId: true,
          earnedAt: true
        }
      })
    ]);

    await this.auditLogService.writeForUser(
      actor,
      'user.data_exported',
      'user',
      targetUserId,
      {
        targetEmail: targetUser.email,
        targetDisplayName: targetUser.displayName,
        exportScope: actor.id === targetUserId ? 'self' : 'admin'
      },
      request
    );

    const { isDeleted: _isDeleted, ...account } = targetUser;

    return {
      exportDate: new Date().toISOString(),
      user: targetUser.displayName,
      email: targetUser.email,
      meta: {
        exportVersion: 3,
        exportedVia: 'secure-backend',
        requestedByUserId: actor.id,
        requestedByRole: actor.role,
        exportScope: actor.id === targetUserId ? 'self' : 'admin'
      },
      data: {
        account,
        stats,
        games: duels,
        exams: scheduledExamsCreated,
        questions: submittedQuestions,
        badges: badges.map((b) => ({
          id: b.id,
          badgeId: b.badgeId,
          earnedAt: b.earnedAt.toISOString()
        })),
        duelAnswers,
        examGrades,
        theoryExamSessions,
        theoryExamAttempts,
        practicalExamAttempts,
        questionReports,
        flashcards,
        reportBookEntries,
        schoolAttendanceEntries,
        swimSessions,
        swimTrainingPlans,
        forumPosts,
        forumReplies,
        sentChatMessages,
        receivedChatMessages,
        notifications,
        pushSubscriptions,
        xpEvents,
        auditLogs,
        learningMaterialsCreated,
        resourcesCreated,
        newsPostsCreated
      }
    };
  }

  async deleteSelf(actor: AuthenticatedUser, request: Request) {
    const user = await this.prisma.user.findUnique({
      where: { id: actor.id }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    if (user.role === AppRole.ADMIN) {
      throw new ForbiddenException('Admin accounts cannot be self-deleted.');
    }

    await this.prisma.user.update({
      where: { id: actor.id },
      data: {
        isDeleted: true,
        refreshTokenHash: null,
        status: AccountStatus.DISABLED
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.self_deleted',
      'user',
      actor.id,
      {
        email: user.email,
        displayName: user.displayName,
        role: user.role
      },
      request
    );

    return { deleted: true };
  }

  async softDeleteUser(actor: AuthenticatedUser, userId: string, request: Request) {
    if (actor.id === userId) {
      throw new ForbiddenException('You cannot delete your own account from this endpoint.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    if (user.role === AppRole.ADMIN) {
      throw new ForbiddenException('Deleting administrator accounts requires a dedicated break-glass workflow.');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        refreshTokenHash: null,
        status: AccountStatus.DISABLED
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.deleted',
      'user',
      userId,
      {
        email: user.email,
        displayName: user.displayName,
        role: user.role
      },
      request
    );

    return { deleted: true };
  }

  async updateAvatarUnlocks(
    actor: AuthenticatedUser,
    userId: string,
    dto: UpdateAvatarUnlocksDto,
    request: Request
  ) {
    const target = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!target || target.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    const avatarIds = dto.avatarIds.map((id) => String(id).trim().slice(0, 120));

    await this.prisma.user.update({
      where: { id: userId },
      data: { unlockedAvatarIds: avatarIds }
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.avatar_unlocks_updated',
      'user',
      userId,
      { avatarIds } as Prisma.InputJsonValue,
      request
    );

    return { success: true, unlockedAvatarIds: avatarIds };
  }

  private sanitizeText(value: string, maxLength: number): string {
    const sanitized = sanitizeHtml(String(value || ''), {
      allowedTags: [],
      allowedAttributes: {}
    }).trim();

    return sanitized.slice(0, maxLength);
  }

  private sanitizeNullableText(value: string, maxLength: number): string | null {
    const sanitized = this.sanitizeText(value, maxLength);
    return sanitized || null;
  }

  private normalizeAvatar(value: string): string {
    const trimmed = String(value || '').trim();
    if (!trimmed) {
      throw new BadRequestException('Avatar id must not be empty.');
    }

    if (!/^[a-z0-9_-]+$/i.test(trimmed)) {
      throw new BadRequestException('Avatar id contains unsupported characters.');
    }

    return trimmed.slice(0, 120);
  }

  async verifyParentalConsent(
    actor: AuthenticatedUser,
    userId: string,
    dto: VerifyParentalConsentDto,
    request: Request
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.isDeleted) {
      throw new NotFoundException('User not found.');
    }

    if (user.parentalConsentStatus !== ParentalConsentStatus.PENDING) {
      throw new BadRequestException(
        `Cannot verify consent: current status is ${user.parentalConsentStatus}, expected PENDING.`
      );
    }

    if (
      dto.status !== ParentalConsentStatus.VERIFIED &&
      dto.status !== ParentalConsentStatus.REJECTED
    ) {
      throw new BadRequestException('Status must be VERIFIED or REJECTED.');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        parentalConsentStatus: dto.status,
        parentalConsentNote: dto.note ?? null,
        parentalConsentVerifiedAt: new Date(),
        parentalConsentVerifiedById: actor.id
      },
      select: adminUserSelect
    });

    await this.auditLogService.writeForUser(
      actor,
      'user.parental_consent_verified',
      'user',
      userId,
      {
        previousStatus: ParentalConsentStatus.PENDING,
        nextStatus: dto.status,
        note: dto.note ?? null
      },
      request
    );

    return updated;
  }

  private isUnderAge(birthDate: Date): boolean {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return age - 1 < DSGVO_MINIMUM_AGE;
    }
    return age < DSGVO_MINIMUM_AGE;
  }

  private normalizeBirthDate(value: string): Date {
    const date = new Date(String(value || '').trim());
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Birth date is invalid.');
    }

    const now = new Date();
    if (date > now) {
      throw new BadRequestException('Birth date cannot be in the future.');
    }

    if (date.getUTCFullYear() < 1900) {
      throw new BadRequestException('Birth date is outside the allowed range.');
    }

    return date;
  }
}
