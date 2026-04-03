import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountStatus, DuelStatus, NotificationType, Prisma } from '@prisma/client';
import { Request } from 'express';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AuditLogService } from '../../common/services/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateDuelDto } from './dto/create-duel.dto';
import { EXTRA_DUEL_QUESTION_BANK, STANDARD_DUEL_QUESTION_BANK } from './duel-question-bank';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

const REMINDER_LEAD_MIN_MS = 15 * 60 * 1000;
const REMINDER_LEAD_MAX_MS = 24 * 60 * 60 * 1000;
const MAX_DUEL_GAME_STATE_BYTES = 200_000;
const MAX_DUEL_CATEGORY_ROUNDS = 4;
const MAX_DUEL_QUESTIONS_PER_ROUND = 5;
const MAX_DUEL_ANSWERS_PER_ROUND = 5;
const MAX_DUEL_OPTIONS_PER_QUESTION = 8;
const MAX_DUEL_KEYWORD_GROUPS = 10;
const MAX_DUEL_KEYWORD_TERMS = 12;
const MAX_DUEL_CLUES = 8;
const MAX_DUEL_TEXT_LENGTH = 600;
const MAX_DUEL_ANSWER_POINTS = 10;
const ALLOWED_DUEL_DIFFICULTIES = new Set(['anfaenger', 'profi', 'experte', 'extra', 'normal']);
const DUEL_CATEGORY_NAMES: Record<string, string> = {
  org: 'Bäderorganisation',
  pol: 'Politik & Wirtschaft',
  aevo: 'Ausbildereignung',
  guess: 'Was bin ich?',
  tech: 'Bädertechnik',
  swim: 'Schwimm- & Rettungslehre',
  first: 'Erste Hilfe',
  hygiene: 'Hygiene',
  health: 'Gesundheitslehre'
};

const duelParticipantSelect = {
  id: true,
  displayName: true,
  role: true
} satisfies Prisma.UserSelect;

const duelInclude = {
  challenger: { select: duelParticipantSelect },
  opponent: { select: duelParticipantSelect },
  winnerUser: { select: duelParticipantSelect },
  duelQuestions: {
    include: {
      question: {
        select: {
          id: true,
          category: true,
          prompt: true,
          options: true,
          explanation: true,
          correctOptionIndex: true
        }
      }
    },
    orderBy: {
      orderIndex: 'asc'
    }
  },
  answers: {
    select: {
      duelQuestionId: true,
      userId: true,
      selectedOptionIndex: true,
      isCorrect: true,
      durationMs: true,
      answeredAt: true
    }
  }
} satisfies Prisma.DuelInclude;

type DuelWithRelations = Prisma.DuelGetPayload<{ include: typeof duelInclude }>;

@Injectable()
export class DuelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService,
    private readonly notificationsService: NotificationsService
  ) {}

  async create(actor: AuthenticatedUser, dto: CreateDuelDto, request: Request) {
    if (!actor.organizationId) {
      throw new BadRequestException('Your account is not assigned to an organization.');
    }

    if (actor.id === dto.opponentId) {
      throw new BadRequestException('You cannot duel yourself.');
    }

    await this.reconcileDueDuelsAndReminders({
      participantUserId: actor.id,
      includeReminders: false
    });

    const existingOpenDuel = await this.prisma.duel.findFirst({
      where: {
        organizationId: actor.organizationId,
        status: {
          in: [DuelStatus.PENDING, DuelStatus.ACTIVE]
        },
        expiresAt: {
          gt: new Date()
        },
        OR: [
          {
            challengerId: actor.id,
            opponentId: dto.opponentId
          },
          {
            challengerId: dto.opponentId,
            opponentId: actor.id
          }
        ]
      },
      select: {
        id: true
      }
    });

    if (existingOpenDuel) {
      throw new ConflictException('A duel with this opponent is already active or awaiting acceptance.');
    }

    const opponent = await this.prisma.user.findFirst({
      where: {
        id: dto.opponentId,
        organizationId: actor.organizationId,
        status: AccountStatus.APPROVED,
        isDeleted: false
      },
      select: duelParticipantSelect
    });

    if (!opponent) {
      throw new NotFoundException('Opponent is not available in your organization.');
    }

    const questionCount =
      dto.questionCount ?? Number(this.configService.get<number>('DUEL_DEFAULT_QUESTION_COUNT', 10));
    const requestTimeoutMinutes = this.normalizeRequestTimeoutMinutes(dto.requestTimeoutMinutes);
    const availableQuestions = await this.prisma.question.findMany({
      where: {
        isActive: true,
        ...(dto.category ? { category: dto.category.trim() } : {})
      },
      select: {
        id: true
      },
      take: questionCount * 3
    });

    if (availableQuestions.length < questionCount) {
      throw new BadRequestException('Not enough active questions are available for this duel.');
    }

    const selectedQuestions = this.shuffle(availableQuestions)
      .slice(0, questionCount)
      .map((question) => question.id);

    const duel = await this.prisma.$transaction(async (tx) => {
      const created = await tx.duel.create({
        data: {
          organizationId: actor.organizationId!,
          challengerId: actor.id,
          opponentId: dto.opponentId,
          status: DuelStatus.PENDING,
          questionCount,
          expiresAt: this.buildPendingExpiryDate(requestTimeoutMinutes),
          reminderSentAt: null
        }
      });

      await tx.duelQuestion.createMany({
        data: selectedQuestions.map((questionId, index) => ({
          duelId: created.id,
          questionId,
          orderIndex: index
        }))
      });

      return tx.duel.findUniqueOrThrow({
        where: { id: created.id },
        include: duelInclude
      });
    });

    await this.notificationsService.createForUser(opponent.id, {
      title: 'Neue Quizduell-Herausforderung',
      message: `${actor.displayName} hat dich zu einem Quizduell herausgefordert.`,
      type: NotificationType.INFO,
      metadata: {
        duelId: duel.id,
        status: duel.status
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'duel.created',
      'duel',
      duel.id,
      {
        opponentId: dto.opponentId,
        questionCount,
        requestTimeoutMinutes
      },
      request
    );

    return this.toDuelPayload(duel, actor.id);
  }

  async accept(actor: AuthenticatedUser, duelId: string, request: Request) {
    const duel = await this.prisma.duel.findUnique({
      where: { id: duelId },
      include: duelInclude
    });

    if (!duel) {
      throw new NotFoundException('Duel not found.');
    }

    if (duel.opponentId !== actor.id) {
      throw new ForbiddenException('Only the challenged user may accept this duel.');
    }

    if (duel.status !== DuelStatus.PENDING) {
      throw new ConflictException('This duel is not awaiting acceptance.');
    }

    if (this.isDuelExpired(duel)) {
      await this.expireDuelAndNotify(duel);
      throw new ConflictException('This duel request has expired.');
    }

    const updated = await this.prisma.duel.update({
      where: { id: duel.id },
      data: {
        status: DuelStatus.ACTIVE,
        startedAt: new Date(),
        expiresAt: this.buildTurnExpiryDate(),
        reminderSentAt: null
      },
      include: duelInclude
    });

    await this.notificationsService.createForUser(duel.challenger.id, {
      title: 'Quizduell angenommen',
      message: `${actor.displayName} hat deine Herausforderung angenommen.`,
      type: NotificationType.SUCCESS,
      metadata: {
        duelId: duel.id,
        status: updated.status
      }
    });

    await this.auditLogService.writeForUser(
      actor,
      'duel.accepted',
      'duel',
      duel.id,
      {},
      request
    );

    return this.toDuelPayload(updated, actor.id);
  }

  async updateGameState(actor: AuthenticatedUser, duelId: string, gameState: Record<string, unknown>) {
    const duel = await this.prisma.duel.findUnique({
      where: { id: duelId },
      include: duelInclude
    });

    if (!duel) {
      throw new NotFoundException('Duel not found.');
    }

    if (duel.challengerId !== actor.id && duel.opponentId !== actor.id) {
      throw new ForbiddenException('You are not a participant in this duel.');
    }

    if (duel.status === DuelStatus.COMPLETED || duel.status === DuelStatus.EXPIRED) {
      return this.toDuelSummary(duel, actor.id);
    }

    this.assertGameStatePayloadSize(gameState);
    const previousGameState = this.normalizeGameState(duel, duel.gameState);
    const normalizedGameState = this.normalizeGameState(duel, gameState);
    const authoritativeGameState = await this.applyAuthoritativeRoundGeneration(
      duel,
      previousGameState,
      normalizedGameState
    );
    this.assertValidGameStateTransition(duel, previousGameState, authoritativeGameState, actor);
    const shouldComplete = duel.status === DuelStatus.ACTIVE && authoritativeGameState.status === 'finished';
    const winnerUserId = shouldComplete
      ? this.resolveWinnerUserId(duel, this.readString(authoritativeGameState.winner))
      : undefined;

    const updated = await this.prisma.duel.update({
      where: { id: duelId },
      data: {
        gameState: authoritativeGameState,
        status: shouldComplete ? DuelStatus.COMPLETED : undefined,
        winnerUserId,
        completedAt: shouldComplete ? new Date() : undefined,
        expiresAt: shouldComplete ? null : undefined,
        reminderSentAt: shouldComplete ? null : undefined
      },
      include: duelInclude
    });

    return this.toDuelSummary(updated, actor.id);
  }

  async forfeit(actor: AuthenticatedUser, duelId: string, request: Request) {
    const duel = await this.prisma.duel.findUnique({
      where: { id: duelId },
      include: duelInclude
    });

    if (!duel) {
      throw new NotFoundException('Duel not found.');
    }

    if (duel.challengerId !== actor.id && duel.opponentId !== actor.id) {
      throw new ForbiddenException('You are not a participant in this duel.');
    }

    if (duel.status !== DuelStatus.ACTIVE && duel.status !== DuelStatus.PENDING) {
      throw new ConflictException('This duel cannot be forfeited.');
    }

    const winnerId = duel.challengerId === actor.id ? duel.opponentId : duel.challengerId;
    const winner = duel.challengerId === actor.id ? duel.opponent : duel.challenger;

    const updated = await this.prisma.duel.update({
      where: { id: duelId },
      data: {
        status: DuelStatus.COMPLETED,
        winnerUserId: winnerId,
        completedAt: new Date(),
        expiresAt: null,
        reminderSentAt: null
      },
      include: duelInclude
    });

    await this.notificationsService.createForUser(winnerId, {
      title: 'Quizduell gewonnen!',
      message: `${actor.displayName} hat das Duell aufgegeben. Du gewinnst!`,
      type: NotificationType.SUCCESS,
      metadata: { duelId: duel.id, status: updated.status }
    });

    await this.auditLogService.writeForUser(
      actor,
      'duel.forfeited',
      'duel',
      duel.id,
      { winnerId, winnerName: winner.displayName },
      request
    );

    return this.toDuelSummary(updated, actor.id);
  }

  private async applyAuthoritativeRoundGeneration(
    duel: DuelWithRelations,
    previousGameState: Prisma.InputJsonObject,
    nextGameState: Prisma.InputJsonObject
  ): Promise<Prisma.InputJsonObject> {
    const previousRounds = Array.isArray(previousGameState.categoryRounds)
      ? previousGameState.categoryRounds
      : [];
    const nextRounds = Array.isArray(nextGameState.categoryRounds)
      ? nextGameState.categoryRounds
      : [];

    if (nextRounds.length !== previousRounds.length + 1) {
      return nextGameState;
    }

    const newRoundIndex = nextRounds.length - 1;
    const newRound = this.asRecord(nextRounds[newRoundIndex]);
    const categoryId = this.readString(newRound.categoryId) ?? '';
    if (!categoryId) {
      return nextGameState;
    }

    const generatedQuestions = await this.generateAuthoritativeRoundQuestions(
      categoryId,
      this.normalizeDifficulty(nextGameState.difficulty)
    );
    if (!generatedQuestions) {
      return nextGameState;
    }

    const chooser = this.getExpectedNextChooserName(duel, previousRounds);
    const authoritativeRound: Prisma.InputJsonObject = {
      categoryId,
      categoryName: DUEL_CATEGORY_NAMES[categoryId] ?? (this.sanitizeText(newRound.categoryName, 120) || categoryId),
      chooser,
      questions: generatedQuestions,
      player1Answers: this.normalizeAnswerArray([]),
      player2Answers: this.normalizeAnswerArray([])
    };

    return {
      ...nextGameState,
      currentTurn: chooser,
      categoryRound: newRoundIndex,
      categoryRounds: [...previousRounds, authoritativeRound]
    } as Prisma.InputJsonObject;
  }

  private resolveWinnerUserId(
    duel: Pick<DuelWithRelations, 'challenger' | 'opponent'>,
    winnerDisplayName?: string | null
  ): string | null | undefined {
    if (!winnerDisplayName) {
      return null;
    }
    if (duel.challenger.displayName === winnerDisplayName) return duel.challenger.id;
    if (duel.opponent.displayName === winnerDisplayName) return duel.opponent.id;
    return undefined;
  }

  async listMine(actor: AuthenticatedUser) {
    await this.reconcileDueDuelsAndReminders({
      participantUserId: actor.id
    });

    const duels = await this.prisma.duel.findMany({
      where: {
        OR: [{ challengerId: actor.id }, { opponentId: actor.id }]
      },
      include: duelInclude,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return duels.map((duel) => this.toDuelSummary(duel, actor.id));
  }

  async getOne(actor: AuthenticatedUser, duelId: string) {
    await this.reconcileDueDuelsAndReminders({
      participantUserId: actor.id
    });

    const duel = await this.prisma.duel.findUnique({
      where: { id: duelId },
      include: duelInclude
    });

    if (!duel) {
      throw new NotFoundException('Duel not found.');
    }

    this.assertDuelParticipant(actor, duel);
    return this.toDuelPayload(duel, actor.id);
  }

  async submitAnswer(actor: AuthenticatedUser, duelId: string, dto: SubmitAnswerDto, request: Request) {
    const result = await this.prisma.$transaction(async (tx) => {
      const duel = await tx.duel.findUnique({
        where: { id: duelId },
        include: duelInclude
      });

      if (!duel) {
        throw new NotFoundException('Duel not found.');
      }

      this.assertDuelParticipant(actor, duel);

      if (duel.status !== DuelStatus.ACTIVE) {
        throw new ConflictException('Duel is not active.');
      }

      if (this.isDuelExpired(duel)) {
        await tx.duel.update({
          where: { id: duel.id },
          data: {
            status: DuelStatus.EXPIRED,
            reminderSentAt: null
          }
        });
        throw new ConflictException('Duel has expired.');
      }

      const duelQuestion = duel.duelQuestions.find((entry) => entry.id === dto.duelQuestionId);
      if (!duelQuestion) {
        throw new NotFoundException('Assigned duel question not found.');
      }

      const authoritativeGameState = this.mergePersistedAnswersIntoGameState(duel);
      const authoritativeQuestion = this.getQuestionByOrderIndex(authoritativeGameState, duelQuestion.orderIndex);
      const authoritativeOptions = authoritativeQuestion
        ? this.normalizeStringArray(authoritativeQuestion.a, MAX_DUEL_OPTIONS_PER_QUESTION, 240)
        : this.extractOptions(duelQuestion.question.options);
      const authoritativeCorrectIndex = authoritativeQuestion
        ? (this.readInteger(authoritativeQuestion.correct) ?? duelQuestion.question.correctOptionIndex)
        : duelQuestion.question.correctOptionIndex;

      const existingAnswer = await tx.duelAnswer.findUnique({
        where: {
          duelQuestionId_userId: {
            duelQuestionId: duelQuestion.id,
            userId: actor.id
          }
        }
      });

      if (existingAnswer) {
        const syncedGameState = this.mergePersistedAnswersIntoGameState(duel);
        const duplicate = this.isSameJsonValue(duel.gameState, syncedGameState)
          ? duel
          : await tx.duel.update({
              where: { id: duel.id },
              data: {
                gameState: syncedGameState
              },
              include: duelInclude
            });

        return {
          duel: duplicate,
          finalized: false
        };
      }

      const optionCount = authoritativeOptions.length;
      if (dto.selectedOptionIndex >= optionCount) {
        throw new BadRequestException('selectedOptionIndex is outside the question option range.');
      }

      await tx.duelAnswer.create({
        data: {
          duelId: duel.id,
          duelQuestionId: duelQuestion.id,
          userId: actor.id,
          selectedOptionIndex: dto.selectedOptionIndex,
          isCorrect: dto.selectedOptionIndex === authoritativeCorrectIndex,
          durationMs: dto.durationMs ?? 0
        }
      });

      const withLatestAnswers = await tx.duel.findUniqueOrThrow({
        where: { id: duel.id },
        include: duelInclude
      });
      const syncedGameState = this.mergePersistedAnswersIntoGameState(withLatestAnswers);

      if (withLatestAnswers.answers.length >= withLatestAnswers.questionCount * 2) {
        const finalized = await tx.duel.update({
          where: { id: duel.id },
          data: {
            ...this.buildFinalizationUpdate(withLatestAnswers),
            gameState: syncedGameState
          },
          include: duelInclude
        });

        return {
          duel: finalized,
          finalized: true
        };
      }

      const continued = await tx.duel.update({
        where: { id: duel.id },
        data: {
          gameState: syncedGameState,
          expiresAt: this.buildTurnExpiryDate(),
          reminderSentAt: null
        },
        include: duelInclude
      });

      return {
        duel: continued,
        finalized: false
      };
    });

    if (result.finalized) {
      await this.notifyDuelCompleted(result.duel);
      await this.auditLogService.writeForUser(
        actor,
        'duel.completed',
        'duel',
        duelId,
        this.toDuelSummary(result.duel, actor.id),
        request
      );
    }

    return this.toDuelPayload(result.duel, actor.id);
  }

  async leaderboard(actor: AuthenticatedUser) {
    if (!actor.organizationId) {
      return [];
    }

    const duels = await this.prisma.duel.findMany({
      where: {
        organizationId: actor.organizationId,
        status: DuelStatus.COMPLETED
      },
      select: {
        challengerId: true,
        opponentId: true,
        winnerUserId: true,
        challenger: {
          select: duelParticipantSelect
        },
        opponent: {
          select: duelParticipantSelect
        }
      }
    });

    const table = new Map<
      string,
      { userId: string; displayName: string; role: string; wins: number; losses: number; draws: number }
    >();

    for (const duel of duels) {
      for (const participant of [duel.challenger, duel.opponent]) {
        if (!table.has(participant.id)) {
          table.set(participant.id, {
            userId: participant.id,
            displayName: participant.displayName,
            role: participant.role,
            wins: 0,
            losses: 0,
            draws: 0
          });
        }
      }

      if (!duel.winnerUserId) {
        table.get(duel.challengerId)!.draws += 1;
        table.get(duel.opponentId)!.draws += 1;
        continue;
      }

      const loserId = duel.winnerUserId === duel.challengerId ? duel.opponentId : duel.challengerId;
      table.get(duel.winnerUserId)!.wins += 1;
      table.get(loserId)!.losses += 1;
    }

    return [...table.values()].sort((left, right) => {
      if (right.wins !== left.wins) {
        return right.wins - left.wins;
      }
      if (right.draws !== left.draws) {
        return right.draws - left.draws;
      }
      return left.losses - right.losses;
    });
  }

  async reconcileDueDuelsAndReminders(options: { participantUserId?: string; includeReminders?: boolean } = {}) {
    const includeReminders = options.includeReminders ?? true;
    const now = new Date();
    let expiredCount = 0;
    let remindedCount = 0;

    const dueWhere = this.buildLifecycleScopeWhere(options.participantUserId);
    const expiredDuels = await this.prisma.duel.findMany({
      where: {
        ...dueWhere,
        status: {
          in: [DuelStatus.PENDING, DuelStatus.ACTIVE]
        },
        expiresAt: {
          lte: now
        }
      },
      include: duelInclude
    });

    for (const duel of expiredDuels) {
      await this.expireDuelAndNotify(duel);
      expiredCount += 1;
    }

    if (!includeReminders) {
      return { expiredCount, remindedCount };
    }

    const reminderCandidates = await this.prisma.duel.findMany({
      where: {
        ...dueWhere,
        status: {
          in: [DuelStatus.PENDING, DuelStatus.ACTIVE]
        },
        expiresAt: {
          gt: now
        },
        reminderSentAt: null
      },
      include: duelInclude
    });

    for (const duel of reminderCandidates) {
      if (!this.shouldSendReminder(duel, now)) {
        continue;
      }

      const recipientIds = this.getReminderRecipientIds(duel);
      if (recipientIds.length === 0) {
        continue;
      }

      for (const recipientId of recipientIds) {
        await this.notificationsService.createForUser(recipientId, {
          title: duel.status === DuelStatus.PENDING ? 'Quizduell wartet auf Annahme' : 'Quizduell-Erinnerung',
          message: duel.status === DuelStatus.PENDING
            ? `Die Herausforderung von ${duel.challenger.displayName} läuft bald ab.`
            : `Dein Quizduell gegen ${this.getDisplayOpponentNameForReminder(duel, recipientId)} läuft bald ab.`,
          type: NotificationType.WARNING,
          metadata: {
            duelId: duel.id,
            status: duel.status,
            expiresAt: duel.expiresAt
          }
        });
      }

      await this.prisma.duel.update({
        where: { id: duel.id },
        data: {
          reminderSentAt: now
        }
      });
      remindedCount += recipientIds.length;
    }

    return { expiredCount, remindedCount };
  }

  private buildFinalizationUpdate(duel: DuelWithRelations) {
    const challengerScore = duel.answers.filter(
      (answer) => answer.userId === duel.challengerId && answer.isCorrect
    ).length;
    const opponentScore = duel.answers.filter(
      (answer) => answer.userId === duel.opponentId && answer.isCorrect
    ).length;

    let winnerUserId: string | null = null;
    if (challengerScore > opponentScore) {
      winnerUserId = duel.challengerId;
    } else if (opponentScore > challengerScore) {
      winnerUserId = duel.opponentId;
    }

    return {
      status: DuelStatus.COMPLETED,
      completedAt: new Date(),
      winnerUserId,
      expiresAt: null,
      reminderSentAt: null
    };
  }

  private async notifyDuelCompleted(duel: DuelWithRelations) {
    const winnerName = duel.winnerUser?.displayName || null;
    const title = winnerName ? 'Quizduell beendet' : 'Quizduell unentschieden';

    await this.notificationsService.createForUsers([duel.challengerId, duel.opponentId], {
      title,
      message: winnerName
        ? `Das Quizduell ist abgeschlossen. ${winnerName} hat gewonnen.`
        : 'Das Quizduell ist abgeschlossen und endete unentschieden.',
      type: winnerName ? NotificationType.SUCCESS : NotificationType.INFO,
      metadata: {
        duelId: duel.id,
        status: duel.status,
        winnerUserId: duel.winnerUser?.id ?? null
      }
    });
  }

  private async expireDuelAndNotify(duel: DuelWithRelations) {
    const updated = await this.prisma.duel.update({
      where: { id: duel.id },
      data: {
        status: DuelStatus.EXPIRED,
        reminderSentAt: null
      },
      include: duelInclude
    });

    const message = duel.status === DuelStatus.PENDING
      ? `Die Herausforderung zwischen ${duel.challenger.displayName} und ${duel.opponent.displayName} ist abgelaufen.`
      : `Das aktive Quizduell zwischen ${duel.challenger.displayName} und ${duel.opponent.displayName} ist wegen Fristablauf beendet worden.`;

    await this.notificationsService.createForUsers([duel.challengerId, duel.opponentId], {
      title: 'Quizduell abgelaufen',
      message,
      type: NotificationType.WARNING,
      metadata: {
        duelId: updated.id,
        status: updated.status
      }
    });

    return updated;
  }

  private shouldSendReminder(duel: DuelWithRelations, now: Date) {
    const expiresAtMs = duel.expiresAt?.getTime();
    if (!expiresAtMs) {
      return false;
    }

    const baseTimestamp = duel.status === DuelStatus.PENDING
      ? duel.createdAt.getTime()
      : duel.updatedAt.getTime();
    const ttlMs = Math.max(REMINDER_LEAD_MIN_MS, expiresAtMs - baseTimestamp);
    const reminderLeadMs = Math.min(
      REMINDER_LEAD_MAX_MS,
      Math.max(REMINDER_LEAD_MIN_MS, Math.floor(ttlMs / 2))
    );

    return now.getTime() >= expiresAtMs - reminderLeadMs;
  }

  private getReminderRecipientIds(duel: DuelWithRelations) {
    if (duel.status === DuelStatus.PENDING) {
      return [duel.opponentId];
    }

    if (duel.status !== DuelStatus.ACTIVE) {
      return [];
    }

    const answeredByUser = new Map<string, number>();
    for (const answer of duel.answers) {
      answeredByUser.set(answer.userId, (answeredByUser.get(answer.userId) ?? 0) + 1);
    }

    return [duel.challengerId, duel.opponentId].filter((userId) => (
      (answeredByUser.get(userId) ?? 0) < duel.questionCount
    ));
  }

  private getDisplayOpponentNameForReminder(duel: DuelWithRelations, recipientUserId: string) {
    return duel.challengerId === recipientUserId
      ? duel.opponent.displayName
      : duel.challenger.displayName;
  }

  private buildLifecycleScopeWhere(participantUserId?: string): Prisma.DuelWhereInput {
    if (!participantUserId) {
      return {};
    }

    return {
      OR: [
        {
          challengerId: participantUserId
        },
        {
          opponentId: participantUserId
        }
      ]
    };
  }

  private buildPendingExpiryDate(requestTimeoutMinutes?: number) {
    const timeoutMinutes = this.normalizeRequestTimeoutMinutes(requestTimeoutMinutes);
    return new Date(Date.now() + timeoutMinutes * 60 * 1000);
  }

  private buildTurnExpiryDate() {
    const timeoutMinutes = this.normalizeTurnTimeoutMinutes();
    return new Date(Date.now() + timeoutMinutes * 60 * 1000);
  }

  private normalizeRequestTimeoutMinutes(value?: number) {
    const configured = Number(
      value ?? this.configService.get<number>('DUEL_REQUEST_TTL_MINUTES', 2880)
    );
    if (!Number.isFinite(configured)) {
      return 2880;
    }

    return Math.min(10080, Math.max(15, Math.round(configured)));
  }

  private normalizeTurnTimeoutMinutes() {
    const configured = Number(this.configService.get<number>('DUEL_TURN_TTL_MINUTES', 2880));
    if (!Number.isFinite(configured)) {
      return 2880;
    }

    return Math.min(10080, Math.max(15, Math.round(configured)));
  }

  private isDuelExpired(duel: Pick<DuelWithRelations, 'expiresAt'>) {
    return Boolean(duel.expiresAt && duel.expiresAt.getTime() <= Date.now());
  }

  private toDuelPayload(duel: DuelWithRelations, actorId: string) {
    const score = this.computeScore(duel);
    const authoritativeGameState = this.mergePersistedAnswersIntoGameState(duel);
    const answersByQuestion = new Map(
      duel.answers
        .filter((answer) => answer.userId === actorId)
        .map((answer) => [answer.duelQuestionId, answer])
    );

    return {
      ...this.toDuelSummary(duel, actorId),
      questions: duel.duelQuestions.map((assignment) => ({
        id: assignment.id,
        orderIndex: assignment.orderIndex,
        question: this.buildPayloadQuestionForAssignment(
          assignment,
          authoritativeGameState,
          duel.status === DuelStatus.COMPLETED || answersByQuestion.has(assignment.id)
        ),
        myAnswer: answersByQuestion.get(assignment.id) ?? null
      })),
      score
    };
  }

  private toDuelSummary(duel: DuelWithRelations, actorId: string) {
    const normalizedGameState = this.mergePersistedAnswersIntoGameState(duel);
    const redactedGameState = this.redactUnansweredQuestionsForActor(normalizedGameState, actorId, duel);
    const score = this.computeScore(duel);
    const myUserId = actorId;
    const opponentUserId = duel.challengerId === actorId ? duel.opponentId : duel.challengerId;

    return {
      id: duel.id,
      status: duel.status,
      questionCount: duel.questionCount,
      gameState: redactedGameState,
      expiresAt: duel.expiresAt,
      startedAt: duel.startedAt,
      completedAt: duel.completedAt,
      createdAt: duel.createdAt,
      updatedAt: duel.updatedAt,
      challenger: duel.challenger,
      opponent: duel.opponent,
      winnerUser: duel.winnerUser,
      challengerScore: score[duel.challengerId] ?? 0,
      duelOpponentScore: score[duel.opponentId] ?? 0,
      myScore: score[myUserId] ?? 0,
      opponentScore: score[opponentUserId] ?? 0,
      myAnsweredCount: duel.answers.filter((answer) => answer.userId === myUserId).length
    };
  }

  /**
   * Entfernt `correct`, `keywordGroups` und `minKeywordGroups` aus Fragen,
   * die der Spieler noch nicht beantwortet hat. So kann ein Spieler per
   * DevTools nicht die richtigen Antworten aus der API-Response ablesen,
   * bevor er die Runde gespielt hat.
   *
   * Eine Runde gilt für den Akteur als "noch offen", wenn seine eigene
   * Antwortliste kürzer ist als die Fragenliste der Runde.
   */
  private redactUnansweredQuestionsForActor(
    gameState: Prisma.InputJsonObject,
    actorId: string,
    duel: DuelWithRelations
  ): Prisma.InputJsonObject {
    const categoryRounds = Array.isArray(gameState.categoryRounds)
      ? gameState.categoryRounds
      : [];

    const actorIsChallenger = duel.challengerId === actorId;
    const actorAnswerKey = actorIsChallenger ? 'player1Answers' : 'player2Answers';

    const redactedRounds = categoryRounds.map((round) => {
      const r = this.asRecord(round);
      const questions = Array.isArray(r.questions) ? r.questions : [];
      const actorAnswers = Array.isArray(r[actorAnswerKey]) ? r[actorAnswerKey] : [];
      const answeredQuestionIndexes = new Set<number>();

      (actorAnswers as unknown[]).forEach((answer, answerIndex) => {
        const answerRecord = this.asRecord(answer);
        const questionIndex = this.readInteger(answerRecord.questionIndex);
        if (questionIndex !== null && questionIndex >= 0 && questionIndex < questions.length) {
          answeredQuestionIndexes.add(questionIndex);
          return;
        }
        if (answerIndex < questions.length) {
          answeredQuestionIndexes.add(answerIndex);
        }
      });

      // Nur noch unbeantwortete Fragen bleiben redaktiert.
      if (answeredQuestionIndexes.size < questions.length) {
        const redactedQuestions = questions.map((q, questionIndex) => {
          if (answeredQuestionIndexes.has(questionIndex)) {
            return q as Prisma.InputJsonObject;
          }
          const { correct: _correct, keywordGroups: _kg, minKeywordGroups: _mkg, ...rest } = this.asRecord(q);
          return rest as Prisma.InputJsonObject;
        });
        return { ...r, questions: redactedQuestions } as Prisma.InputJsonObject;
      }

      return round as Prisma.InputJsonObject;
    });

    return { ...gameState, categoryRounds: redactedRounds };
  }

  private computeScore(duel: DuelWithRelations) {
    const gameStateScore = this.computeGameStateScore(
      this.mergePersistedAnswersIntoGameState(duel) as Prisma.JsonObject
    );
    if (gameStateScore) {
      return {
        [duel.challengerId]: gameStateScore.player1Score,
        [duel.opponentId]: gameStateScore.player2Score
      };
    }

    const scoreboard: Record<string, number> = {};
    for (const answer of duel.answers) {
      if (!scoreboard[answer.userId]) {
        scoreboard[answer.userId] = 0;
      }
      if (answer.isCorrect) {
        scoreboard[answer.userId] += 1;
      }
    }
    return scoreboard;
  }

  private mergePersistedAnswersIntoGameState(duel: DuelWithRelations): Prisma.InputJsonObject {
    const normalizedGameState = this.normalizeGameState(duel, duel.gameState);
    const categoryRounds = Array.isArray(normalizedGameState.categoryRounds)
      ? normalizedGameState.categoryRounds.map((round) => this.asRecord(round))
      : [];

    for (const assignment of duel.duelQuestions) {
      const roundIndex = Math.floor(assignment.orderIndex / MAX_DUEL_QUESTIONS_PER_ROUND);
      const questionIndex = assignment.orderIndex % MAX_DUEL_QUESTIONS_PER_ROUND;
      const round = categoryRounds[roundIndex];
      if (!round) {
        continue;
      }

      const questions = Array.isArray(round.questions) ? round.questions : [];
      const question = this.asRecord(questions[questionIndex] ?? {});
      for (const storedAnswer of duel.answers.filter((answer) => answer.duelQuestionId === assignment.id)) {
        const answerEntry = this.revalidateAnswerEntry({
          questionIndex,
          correct: storedAnswer.isCorrect,
          timeout: false,
          points: storedAnswer.isCorrect ? 1 : 0,
          answerType: 'single',
          selectedAnswer: storedAnswer.selectedOptionIndex
        } as Prisma.InputJsonObject, question);

        if (storedAnswer.userId === duel.challengerId) {
          const currentAnswers = Array.isArray(round.player1Answers) ? round.player1Answers : [];
          round.player1Answers = this.upsertPersistedAnswer(currentAnswers, answerEntry);
        } else if (storedAnswer.userId === duel.opponentId) {
          const currentAnswers = Array.isArray(round.player2Answers) ? round.player2Answers : [];
          round.player2Answers = this.upsertPersistedAnswer(currentAnswers, answerEntry);
        }
      }
    }

    return this.normalizeGameState(duel, {
      ...normalizedGameState,
      categoryRounds
    });
  }

  private buildPayloadQuestionForAssignment(
    assignment: DuelWithRelations['duelQuestions'][number],
    authoritativeGameState: Prisma.InputJsonObject,
    mayRevealCorrect: boolean
  ) {
    const authoritativeQuestion = this.getQuestionByOrderIndex(authoritativeGameState, assignment.orderIndex);
    const authoritativeOptions = authoritativeQuestion
      ? this.normalizeStringArray(authoritativeQuestion.a, MAX_DUEL_OPTIONS_PER_QUESTION, 240)
      : this.extractOptions(assignment.question.options);
    const authoritativeCorrectIndex = authoritativeQuestion
      ? this.readInteger(authoritativeQuestion.correct)
      : assignment.question.correctOptionIndex;
    const authoritativePrompt = authoritativeQuestion
      ? (this.readString(authoritativeQuestion.prompt) ?? this.readString(authoritativeQuestion.q) ?? assignment.question.prompt)
      : assignment.question.prompt;
    const authoritativeCategory = authoritativeQuestion
      ? (this.readString(authoritativeQuestion.category) ?? assignment.question.category)
      : assignment.question.category;

    return {
      id: assignment.question.id,
      category: authoritativeCategory,
      prompt: authoritativePrompt,
      options: authoritativeOptions,
      correctOptionIndex: mayRevealCorrect ? authoritativeCorrectIndex : null,
      explanation: mayRevealCorrect ? assignment.question.explanation : null
    };
  }

  private getQuestionByOrderIndex(gameState: Prisma.InputJsonObject, orderIndex: number) {
    const roundIndex = Math.floor(orderIndex / MAX_DUEL_QUESTIONS_PER_ROUND);
    const questionIndex = orderIndex % MAX_DUEL_QUESTIONS_PER_ROUND;
    const rounds = Array.isArray(gameState.categoryRounds) ? gameState.categoryRounds : [];
    const round = this.asRecord(rounds[roundIndex]);
    const questions = Array.isArray(round.questions) ? round.questions : [];
    return this.asRecord(questions[questionIndex]);
  }

  private upsertPersistedAnswer(
    answerList: unknown[],
    answerEntry: Prisma.InputJsonObject
  ): Prisma.InputJsonArray {
    const nextAnswers = [...answerList];
    const questionIndex = this.readInteger(answerEntry.questionIndex) ?? -1;
    const existingIndex = nextAnswers.findIndex((entry) => (
      this.readInteger(this.asRecord(entry).questionIndex) === questionIndex
    ));

    if (existingIndex >= 0) {
      nextAnswers[existingIndex] = answerEntry;
    } else {
      nextAnswers.push(answerEntry);
    }

    nextAnswers.sort((left, right) => {
      const leftIndex = this.readInteger(this.asRecord(left).questionIndex) ?? 0;
      const rightIndex = this.readInteger(this.asRecord(right).questionIndex) ?? 0;
      return leftIndex - rightIndex;
    });

    return nextAnswers as Prisma.InputJsonArray;
  }

  private extractOptions(options: Prisma.JsonValue): string[] {
    return Array.isArray(options) ? options.map((entry) => String(entry)) : [];
  }

  private assertGameStatePayloadSize(gameState: Record<string, unknown>) {
    const payloadSize = Buffer.byteLength(JSON.stringify(gameState ?? {}), 'utf8');
    if (payloadSize > MAX_DUEL_GAME_STATE_BYTES) {
      throw new BadRequestException('Duel game state payload is too large.');
    }
  }

  private normalizeGameState(
    duel: DuelWithRelations,
    input: Prisma.JsonValue | Record<string, unknown> | null | undefined
  ): Prisma.InputJsonObject {
    const raw = this.asRecord(input);
    const categoryRounds = this.normalizeCategoryRounds(raw.categoryRounds);
    const scoreboard = this.computeCategoryRoundScores(categoryRounds);
    const requestedStatus = this.normalizeClientGameStatus(raw.status);
    const actualStatus = this.mapClientStatusFromDuelStatus(duel.status);
    const isComplete = duel.status === DuelStatus.ACTIVE
      && requestedStatus === 'finished'
      && this.isCategoryRoundSetComplete(categoryRounds);
    const status = duel.status === DuelStatus.ACTIVE
      ? (isComplete ? 'finished' : 'active')
      : actualStatus;
    const winner = status === 'finished'
      ? this.resolveWinnerDisplayName(duel, scoreboard.player1Score, scoreboard.player2Score)
      : null;
    const currentTurn = status === 'finished'
      ? ''
      : (this.normalizeParticipantName(raw.currentTurn, duel) ?? this.getFallbackCurrentTurn(duel));
    const difficulty = this.normalizeDifficulty(raw.difficulty);
    const categoryRound = this.normalizeCategoryRound(raw.categoryRound, categoryRounds.length, status);
    const timeoutMinutes = this.normalizeRequestTimeoutMinutes(
      this.readInteger(raw.challengeTimeoutMinutes)
        ?? this.readInteger(this.asRecord(duel.gameState).challengeTimeoutMinutes)
        ?? undefined
    );

    return {
      player1Score: scoreboard.player1Score,
      player2Score: scoreboard.player2Score,
      currentTurn,
      categoryRound,
      status,
      difficulty,
      categoryRounds,
      winner,
      challengeTimeoutMinutes: timeoutMinutes
    };
  }

  private computeGameStateScore(input: Prisma.JsonValue | null | undefined) {
    const raw = this.asRecord(input);
    const categoryRounds = this.normalizeCategoryRounds(raw.categoryRounds);
    if (categoryRounds.length === 0) {
      return null;
    }
    return this.computeCategoryRoundScores(categoryRounds);
  }

  private computeCategoryRoundScores(categoryRounds: Prisma.InputJsonArray) {
    let player1Score = 0;
    let player2Score = 0;

    for (const round of categoryRounds) {
      const roundRecord = this.asRecord(round);
      player1Score += this.sumAnswerPoints(roundRecord.player1Answers);
      player2Score += this.sumAnswerPoints(roundRecord.player2Answers);
    }

    return { player1Score, player2Score };
  }

  private async generateAuthoritativeRoundQuestions(
    categoryId: string,
    difficulty: string
  ): Promise<Prisma.InputJsonArray | null> {
    const questionBank = this.getAuthoritativeQuestionBank(categoryId, difficulty);
    if (questionBank.length >= MAX_DUEL_QUESTIONS_PER_ROUND) {
      return this.shuffle(questionBank)
        .slice(0, MAX_DUEL_QUESTIONS_PER_ROUND)
        .map((question) => this.prepareAuthoritativeQuestionEntry(question, categoryId));
    }

    const availableQuestions = await this.prisma.question.findMany({
      where: {
        category: categoryId,
        isActive: true
      },
      select: {
        id: true,
        category: true,
        prompt: true,
        options: true,
        correctOptionIndex: true
      }
    });

    if (availableQuestions.length < MAX_DUEL_QUESTIONS_PER_ROUND) {
      return null;
    }

    return this.shuffle(availableQuestions)
      .slice(0, MAX_DUEL_QUESTIONS_PER_ROUND)
      .map((question) => this.buildAuthoritativeDbQuestionEntry(question));
  }

  private getAuthoritativeQuestionBank(categoryId: string, difficulty: string) {
    const standardBank = STANDARD_DUEL_QUESTION_BANK as Record<string, unknown[]>;
    const extraBank = EXTRA_DUEL_QUESTION_BANK as Record<string, unknown[]>;
    const standardQuestions = Array.isArray(standardBank[categoryId])
      ? standardBank[categoryId]
      : [];
    if (difficulty === 'extra') {
      const extraQuestions = Array.isArray(extraBank[categoryId])
        ? extraBank[categoryId]
        : [];
      if (extraQuestions.length > 0) {
        return extraQuestions;
      }
    }
    return standardQuestions;
  }

  private prepareAuthoritativeQuestionEntry(questionInput: unknown, categoryId: string): Prisma.InputJsonObject {
    const question = this.asRecord(questionInput);
    const answers = Array.isArray(question.a) ? question.a.map((entry) => String(entry)) : [];
    const normalizedQuestion = {
      ...question,
      category: this.readString(question.category) ?? categoryId,
      prompt: this.readString(question.prompt) ?? this.readString(question.q) ?? '',
      q: this.readString(question.q) ?? this.readString(question.prompt) ?? '',
      a: answers
    };

    if (answers.length === 0) {
      return this.normalizeQuestionEntry(normalizedQuestion);
    }

    return this.normalizeQuestionEntry(this.shuffleAuthoritativeQuestionAnswers(normalizedQuestion));
  }

  private buildAuthoritativeDbQuestionEntry(question: {
    id: string;
    category: string;
    prompt: string;
    options: Prisma.JsonValue;
    correctOptionIndex: number;
  }): Prisma.InputJsonObject {
    const shuffledOptions = this.shuffle(
      this.extractOptions(question.options).map((text, originalIndex) => ({
        text,
        originalIndex
      }))
    );

    const correct = Math.max(
      0,
      shuffledOptions.findIndex((entry) => entry.originalIndex === question.correctOptionIndex)
    );

    return {
      id: question.id,
      category: question.category,
      type: 'single',
      prompt: question.prompt,
      q: question.prompt,
      a: shuffledOptions.map((entry) => entry.text),
      correct,
      multi: false,
      timeLimit: 30
    };
  }

  private shuffleAuthoritativeQuestionAnswers(question: Record<string, unknown>) {
    const indexedAnswers = this.shuffle(
      (Array.isArray(question.a) ? question.a : []).map((answer, originalIndex) => ({
        text: String(answer),
        originalIndex
      }))
    );

    const shuffledQuestion: Record<string, unknown> = {
      ...question,
      a: indexedAnswers.map((entry) => entry.text)
    };

    if (Array.isArray(question.correct)) {
      const correctIndexes = new Set(
        (question.correct as unknown[])
          .map((value) => this.readInteger(value))
          .filter((value): value is number => value !== null)
      );

      shuffledQuestion.correct = indexedAnswers
        .map((entry, newIndex) => (correctIndexes.has(entry.originalIndex) ? newIndex : -1))
        .filter((value) => value >= 0);
      shuffledQuestion.multi = true;
      return shuffledQuestion;
    }

    const originalCorrect = this.readInteger(question.correct) ?? 0;
    shuffledQuestion.correct = Math.max(
      0,
      indexedAnswers.findIndex((entry) => entry.originalIndex === originalCorrect)
    );
    return shuffledQuestion;
  }

  private assertValidGameStateTransition(
    duel: DuelWithRelations,
    previousGameState: Prisma.InputJsonObject,
    nextGameState: Prisma.InputJsonObject,
    actor: AuthenticatedUser
  ) {
    const previousRounds = Array.isArray(previousGameState.categoryRounds)
      ? previousGameState.categoryRounds
      : [];
    const nextRounds = Array.isArray(nextGameState.categoryRounds)
      ? nextGameState.categoryRounds
      : [];

    if (nextRounds.length < previousRounds.length) {
      throw new BadRequestException('Duel rounds cannot be removed once stored.');
    }

    if (nextRounds.length > previousRounds.length + 1) {
      throw new BadRequestException('Duel state may only add one new round at a time.');
    }

    const actorIsChallenger = duel.challengerId === actor.id;
    const actorAnswerKey = actorIsChallenger ? 'player1Answers' : 'player2Answers';
    const opponentAnswerKey = actorIsChallenger ? 'player2Answers' : 'player1Answers';
    const expectedNextChooser = this.getExpectedNextChooserName(duel, previousRounds);
    const seenCategories = new Set<string>();

    for (let index = 0; index < nextRounds.length; index += 1) {
      const nextRound = this.asRecord(nextRounds[index]);
      const categoryId = this.readString(nextRound.categoryId);
      if (categoryId) {
        if (seenCategories.has(categoryId)) {
          throw new BadRequestException('Each duel category may only be used once.');
        }
        seenCategories.add(categoryId);
      }

      if (index < previousRounds.length) {
        const previousRound = this.asRecord(previousRounds[index]);
        this.assertRoundMetadataUnchanged(previousRound, nextRound);
        this.assertQuestionsUnchanged(previousRound, nextRound);
        this.assertAnswersUnchangedForOtherParticipant(previousRound, nextRound, opponentAnswerKey);
        this.assertAnswersAppendOnly(previousRound, nextRound, actorAnswerKey);
        continue;
      }

      if (previousRounds.length > 0 && !this.isRoundComplete(this.asRecord(previousRounds[previousRounds.length - 1]))) {
        throw new BadRequestException('A new duel round can only start after the current round is complete.');
      }

      if ((this.readString(nextRound.chooser) ?? '') !== expectedNextChooser) {
        throw new BadRequestException('Only the expected chooser may start the next duel round.');
      }

      if ((this.readString(nextRound.categoryId) ?? '').length === 0) {
        throw new BadRequestException('New duel rounds require a category.');
      }

      const opponentAnswers = Array.isArray(nextRound[opponentAnswerKey]) ? nextRound[opponentAnswerKey] : [];
      if (opponentAnswers.length > 0) {
        throw new BadRequestException('A newly created duel round cannot already contain opponent answers.');
      }
    }

    if (nextGameState.status === 'finished' && !this.isCategoryRoundSetComplete(nextRounds)) {
      throw new BadRequestException('Duel can only be finished after all rounds are complete.');
    }

    if (duel.status === DuelStatus.ACTIVE && nextGameState.status === 'waiting') {
      throw new BadRequestException('An active duel cannot transition back to waiting.');
    }
  }

  private sumAnswerPoints(input: unknown) {
    if (!Array.isArray(input)) {
      return 0;
    }

    return input
      .slice(0, MAX_DUEL_ANSWERS_PER_ROUND)
      .reduce((total, answer) => {
        const answerRecord = this.asRecord(answer);
        const points = this.readInteger(answerRecord.points);
        if (points !== null) {
          return total + Math.max(0, Math.min(MAX_DUEL_ANSWER_POINTS, points));
        }
        return total + (answerRecord.correct === true ? 1 : 0);
      }, 0);
  }

  private normalizeCategoryRounds(input: unknown): Prisma.InputJsonArray {
    if (!Array.isArray(input)) {
      return [];
    }

    return input
      .slice(0, MAX_DUEL_CATEGORY_ROUNDS)
      .map((round) => this.normalizeCategoryRoundEntry(round));
  }

  private normalizeCategoryRoundEntry(input: unknown): Prisma.InputJsonObject {
    const round = this.asRecord(input);
    const questions = this.normalizeQuestionArray(round.questions);
    return {
      categoryId: this.readString(round.categoryId) ?? '',
      categoryName: this.sanitizeText(round.categoryName, 120),
      chooser: this.sanitizeText(round.chooser, 120),
      questions,
      player1Answers: this.normalizeAndValidateAnswerArray(round.player1Answers, questions),
      player2Answers: this.normalizeAndValidateAnswerArray(round.player2Answers, questions)
    };
  }

  /**
   * Normalisiert Antworten und berechnet `correct` + `points` serverseitig,
   * damit ein manipuliertes `correct: true` im Client-Payload ignoriert wird.
   * Keyword- und WhoAmI-Antworten werden nicht neu bewertet (Text-Matching
   * läuft bereits auf dem Client und die Bewertung ist im keywordEvaluation gespeichert).
   */
  private normalizeAndValidateAnswerArray(input: unknown, questions: Prisma.InputJsonArray): Prisma.InputJsonArray {
    if (!Array.isArray(input)) return [];
    return input
      .slice(0, MAX_DUEL_ANSWERS_PER_ROUND)
      .map((answer, index) => {
        const normalized = this.normalizeAnswerEntry(answer);
        const questionIndex = normalized.questionIndex as number;
        const question = this.asRecord(questions[questionIndex] ?? questions[index] ?? {});
        return this.revalidateAnswerEntry(normalized, question);
      });
  }

  /**
   * Überschreibt `correct` und `points` basierend auf der tatsächlichen Frage.
   * Für Single-Choice und Multi-Select wird der gespeicherte `correct`-Wert
   * aus der Frage (nicht aus dem Client-Payload) verwendet.
   */
  private revalidateAnswerEntry(entry: Prisma.InputJsonObject, question: Record<string, unknown>): Prisma.InputJsonObject {
    const answerType = entry.answerType as string;
    const isTimeout = Boolean(entry.timeout);

    if (answerType === 'keyword' || answerType === 'whoami') {
      const evaluation = this.evaluateKeywordAnswer(question, entry.keywordText, isTimeout);
      return {
        ...entry,
        correct: evaluation.isCorrect,
        points: answerType === 'whoami'
          ? (evaluation.isCorrect ? 1 : 0)
          : evaluation.awardedPoints
      };
    }

    const storedCorrect = question.correct;
    if (storedCorrect === undefined || storedCorrect === null) {
      return { ...entry, correct: false, points: 0 };
    }

    let isCorrect: boolean;

    if (Array.isArray(storedCorrect)) {
      // Multi-Select: selectedAnswers muss exakt mit storedCorrect übereinstimmen
      const correctArr = (storedCorrect as unknown[]).map(Number);
      const selectedArr = Array.isArray(entry.selectedAnswers)
        ? (entry.selectedAnswers as unknown[]).map(Number)
        : [];
      isCorrect = !isTimeout &&
        selectedArr.length === correctArr.length &&
        selectedArr.every(idx => correctArr.includes(idx));
    } else {
      // Single-Choice: selectedAnswer muss mit storedCorrect übereinstimmen
      isCorrect = !isTimeout && Number(entry.selectedAnswer) === Number(storedCorrect);
    }

    return { ...entry, correct: isCorrect, points: isCorrect ? 1 : 0 };
  }

  private evaluateKeywordAnswer(
    question: Record<string, unknown>,
    answerInput: unknown,
    isTimeout: boolean
  ) {
    const groups = this.getKeywordGroupsFromQuestion(question);
    const normalizedAnswer = this.normalizeKeywordText(answerInput);
    const answerVariantTokens = this.buildKeywordTokenVariants(answerInput);
    const wordCount = normalizedAnswer ? normalizedAnswer.split(' ').filter(Boolean).length : 0;
    const requiredWordCount = Math.max(0, Number(question.minWords) || 0);
    const requiredGroups = Math.max(
      1,
      Math.min(groups.length || 1, Number(question.minKeywordGroups) || groups.length || 1)
    );

    if (isTimeout || !normalizedAnswer || groups.length === 0) {
      return {
        isCorrect: false,
        awardedPoints: 0
      };
    }

    let matchedCount = 0;
    for (const group of groups) {
      const matched = group.normalizedTerms.some((term) =>
        this.matchesKeywordTerm(normalizedAnswer, answerVariantTokens, term)
      );
      if (matched) {
        matchedCount += 1;
      }
    }

    const hasEnoughWords = wordCount >= requiredWordCount;
    const isCorrect = matchedCount >= requiredGroups && hasEnoughWords;
    const basePoints = matchedCount;
    const bonusPoints = isCorrect ? 2 : 0;
    return {
      isCorrect,
      awardedPoints: Math.max(0, Math.min(MAX_DUEL_ANSWER_POINTS, basePoints + bonusPoints))
    };
  }

  private normalizeQuestionArray(input: unknown): Prisma.InputJsonArray {
    if (!Array.isArray(input)) {
      return [];
    }

    return input
      .slice(0, MAX_DUEL_QUESTIONS_PER_ROUND)
      .map((question) => this.normalizeQuestionEntry(question));
  }

  private normalizeQuestionEntry(input: unknown): Prisma.InputJsonObject {
    const question = this.asRecord(input);
    return {
      id: this.readString(question.id) ?? '',
      category: this.sanitizeText(question.category, 80),
      type: this.sanitizeText(question.type, 24),
      prompt: this.sanitizeText(question.prompt, MAX_DUEL_TEXT_LENGTH),
      q: this.sanitizeText(question.q, MAX_DUEL_TEXT_LENGTH),
      answerGuide: this.sanitizeText(question.answerGuide, MAX_DUEL_TEXT_LENGTH),
      a: this.normalizeStringArray(question.a, MAX_DUEL_OPTIONS_PER_QUESTION, 240),
      clues: this.normalizeStringArray(question.clues, MAX_DUEL_CLUES, 240),
      multi: Boolean(question.multi),
      correct: this.normalizeCorrectAnswer(question.correct),
      keywordGroups: this.normalizeKeywordGroups(question.keywordGroups),
      minKeywordGroups: this.normalizeBoundedInteger(question.minKeywordGroups, 1, MAX_DUEL_KEYWORD_GROUPS, 1),
      minWords: this.normalizeBoundedInteger(question.minWords, 0, 20, 0),
      timeLimit: this.normalizeBoundedInteger(question.timeLimit, 5, 300, 30)
    };
  }

  private normalizeAnswerArray(input: unknown): Prisma.InputJsonArray {
    if (!Array.isArray(input)) {
      return [];
    }

    return input
      .slice(0, MAX_DUEL_ANSWERS_PER_ROUND)
      .map((answer) => this.normalizeAnswerEntry(answer));
  }

  private normalizeAnswerEntry(input: unknown): Prisma.InputJsonObject {
    const answer = this.asRecord(input);
    const answerType = this.sanitizeText(answer.answerType, 24);
    const isCorrect = Boolean(answer.correct);
    const rawPoints = this.normalizeBoundedInteger(answer.points, 0, MAX_DUEL_ANSWER_POINTS, 0) ?? 0;
    // Für Keyword-Antworten sind mehrere Punkte möglich (Schlagwort-Bonus).
    // Für alle anderen Antworttypen darf ein Spieler maximal 1 Punkt erhalten —
    // damit verhindert man, dass ein Client-seitig manipuliertes points-Feld
    // den Score künstlich aufbläst.
    const points = answerType === 'keyword' ? rawPoints : Math.min(1, rawPoints);
    return {
      questionIndex: this.normalizeBoundedInteger(answer.questionIndex, 0, MAX_DUEL_QUESTIONS_PER_ROUND - 1, 0),
      correct: isCorrect,
      timeout: Boolean(answer.timeout),
      points,
      answerType,
      selectedAnswer: this.normalizeBoundedInteger(answer.selectedAnswer, 0, MAX_DUEL_OPTIONS_PER_QUESTION - 1, 0),
      selectedAnswers: this.normalizeIntegerArray(answer.selectedAnswers, MAX_DUEL_OPTIONS_PER_QUESTION, 0, MAX_DUEL_OPTIONS_PER_QUESTION - 1),
      keywordText: this.sanitizeText(answer.keywordText, 240)
    };
  }

  private normalizeKeywordGroups(input: unknown): Prisma.InputJsonArray {
    if (!Array.isArray(input)) {
      return [];
    }

    return input
      .slice(0, MAX_DUEL_KEYWORD_GROUPS)
      .map((entry) => {
        if (Array.isArray(entry)) {
          const terms = this.normalizeStringArray(entry, MAX_DUEL_KEYWORD_TERMS, 120);
          return {
            label: terms[0] ?? 'Schlagwort',
            terms
          };
        }

        const record = this.asRecord(entry);
        const terms = this.normalizeStringArray(record.terms, MAX_DUEL_KEYWORD_TERMS, 120);
        const label = this.sanitizeText(record.label ?? record.name, 120) || terms[0] || 'Schlagwort';
        return {
          label,
          terms
        };
      });
  }

  private getKeywordGroupsFromQuestion(question: Record<string, unknown>) {
    const groups = Array.isArray(question.keywordGroups) ? question.keywordGroups : [];
    return groups
      .map((groupInput) => this.normalizeKeywordGroupRecord(groupInput))
      .filter((group) => group.terms.length > 0)
      .map((group) => ({
        ...group,
        normalizedTerms: [...new Set(group.terms.map((term) => this.normalizeKeywordText(term)).filter(Boolean))]
      }))
      .filter((group) => group.normalizedTerms.length > 0);
  }

  private normalizeKeywordGroupRecord(input: unknown) {
    if (typeof input === 'string') {
      return {
        label: input,
        terms: [input]
      };
    }

    if (Array.isArray(input)) {
      const terms = input
        .map((term) => String(term || '').trim())
        .filter(Boolean);
      return {
        label: terms[0] || 'Schlagwort',
        terms
      };
    }

    const record = this.asRecord(input);
    const label = String(record.label || record.name || '').trim();
    const terms = Array.isArray(record.terms)
      ? record.terms.map((term) => String(term || '').trim()).filter(Boolean)
      : [];

    return {
      label: label || terms[0] || 'Schlagwort',
      terms
    };
  }

  private normalizeKeywordText(value: unknown) {
    return String(value || '')
      .toLowerCase()
      .replace(/ß/g, 'ss')
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private getKeywordWordVariants(normalizedWord: string) {
    const variants = [normalizedWord];
    const addVariant = (candidate: string) => {
      if (candidate && !variants.includes(candidate)) {
        variants.push(candidate);
      }
    };

    addVariant(
      normalizedWord
        .replace(/ae/g, 'a')
        .replace(/oe/g, 'o')
        .replace(/ue/g, 'u')
    );

    if (normalizedWord.endsWith('en') && normalizedWord.length - 2 >= 4) {
      const stem = normalizedWord.slice(0, -2);
      addVariant(stem);
      if (stem.endsWith('e') && stem.length - 1 >= 4) {
        addVariant(stem.slice(0, -1));
      }
    } else if (normalizedWord.endsWith('e') && normalizedWord.length - 1 >= 4) {
      addVariant(normalizedWord.slice(0, -1));
    } else if (normalizedWord.endsWith('s') && normalizedWord.length - 1 >= 4) {
      addVariant(normalizedWord.slice(0, -1));
    }

    return variants;
  }

  private tokenizeKeywordText(value: unknown) {
    return this.normalizeKeywordText(value)
      .split(' ')
      .map((token) => token.trim())
      .filter(Boolean);
  }

  private buildKeywordTokenVariants(value: unknown) {
    const variants = new Set<string>();
    this.tokenizeKeywordText(value).forEach((token) => {
      this.getKeywordWordVariants(token).forEach((variant) => {
        if (variant) {
          variants.add(variant);
        }
      });
    });
    return variants;
  }

  private matchesKeywordTerm(
    normalizedAnswer: string,
    answerVariantTokens: Set<string>,
    term: string
  ) {
    const normalizedTerm = this.normalizeKeywordText(term);
    if (!normalizedTerm) return false;
    if (normalizedAnswer.includes(normalizedTerm)) return true;

    const termTokens = this.tokenizeKeywordText(normalizedTerm);
    if (termTokens.length === 0) return false;

    return termTokens.every((token) => {
      const tokenVariants = this.getKeywordWordVariants(token);
      return tokenVariants.some((variant) => {
        if (!variant) return false;
        if (answerVariantTokens.has(variant)) return true;
        return Array.from(answerVariantTokens).some((answerToken) =>
          answerToken.startsWith(variant) || variant.startsWith(answerToken)
        );
      });
    });
  }

  private normalizeCorrectAnswer(input: unknown): number | Prisma.InputJsonArray {
    if (Array.isArray(input)) {
      return this.normalizeIntegerArray(input, MAX_DUEL_OPTIONS_PER_QUESTION, 0, MAX_DUEL_OPTIONS_PER_QUESTION - 1);
    }

    return this.normalizeBoundedInteger(input, 0, MAX_DUEL_OPTIONS_PER_QUESTION - 1, 0);
  }

  private normalizeStringArray(input: unknown, maxItems: number, maxTextLength: number): Prisma.InputJsonArray {
    if (!Array.isArray(input)) {
      return [];
    }

    return input
      .slice(0, maxItems)
      .map((value) => this.sanitizeText(value, maxTextLength))
      .filter((value) => value.length > 0);
  }

  private normalizeIntegerArray(input: unknown, maxItems: number, min: number, max: number): Prisma.InputJsonArray {
    if (!Array.isArray(input)) {
      return [];
    }

    return input
      .slice(0, maxItems)
      .map((value) => this.normalizeBoundedInteger(value, min, max, min));
  }

  private normalizeBoundedInteger(input: unknown, min: number, max: number, fallback: number) {
    const parsed = this.readInteger(input);
    if (parsed === null) {
      return fallback;
    }
    return Math.max(min, Math.min(max, parsed));
  }

  private normalizeClientGameStatus(input: unknown) {
    const normalized = String(input || '').trim().toLowerCase();
    return normalized === 'finished' ? 'finished' : normalized === 'waiting' ? 'waiting' : 'active';
  }

  private mapClientStatusFromDuelStatus(status: DuelStatus) {
    if (status === DuelStatus.PENDING) {
      return 'waiting';
    }
    if (status === DuelStatus.COMPLETED || status === DuelStatus.EXPIRED) {
      return 'finished';
    }
    return 'active';
  }

  private isCategoryRoundSetComplete(categoryRounds: Prisma.InputJsonArray) {
    if (categoryRounds.length !== MAX_DUEL_CATEGORY_ROUNDS) {
      return false;
    }

    return categoryRounds.every((round) => {
      const roundRecord = this.asRecord(round);
      const questions = Array.isArray(roundRecord.questions) ? roundRecord.questions : [];
      const player1Answers = Array.isArray(roundRecord.player1Answers) ? roundRecord.player1Answers : [];
      const player2Answers = Array.isArray(roundRecord.player2Answers) ? roundRecord.player2Answers : [];
      return questions.length > 0
        && player1Answers.length === questions.length
        && player2Answers.length === questions.length;
    });
  }

  private isRoundComplete(round: Record<string, unknown>) {
    const questions = Array.isArray(round.questions) ? round.questions : [];
    const player1Answers = Array.isArray(round.player1Answers) ? round.player1Answers : [];
    const player2Answers = Array.isArray(round.player2Answers) ? round.player2Answers : [];
    return questions.length > 0
      && player1Answers.length === questions.length
      && player2Answers.length === questions.length;
  }

  private getExpectedNextChooserName(duel: DuelWithRelations, previousRounds: Prisma.InputJsonArray) {
    if (previousRounds.length === 0) {
      return duel.challenger.displayName;
    }

    const lastRound = this.asRecord(previousRounds[previousRounds.length - 1]);
    const lastChooser = this.readString(lastRound.chooser);
    if (lastChooser === duel.challenger.displayName) {
      return duel.opponent.displayName;
    }
    if (lastChooser === duel.opponent.displayName) {
      return duel.challenger.displayName;
    }
    return duel.challenger.displayName;
  }

  private assertRoundMetadataUnchanged(previousRound: Record<string, unknown>, nextRound: Record<string, unknown>) {
    const metadataKeys = ['categoryId', 'categoryName', 'chooser'];
    for (const key of metadataKeys) {
      const previousValue = this.readString(previousRound[key]) ?? '';
      const nextValue = this.readString(nextRound[key]) ?? '';
      if (previousValue !== nextValue) {
        throw new BadRequestException(`Stored duel round ${key} cannot be changed.`);
      }
    }
  }

  private assertQuestionsUnchanged(previousRound: Record<string, unknown>, nextRound: Record<string, unknown>) {
    const previousQuestions = Array.isArray(previousRound.questions) ? previousRound.questions : [];
    const nextQuestions = Array.isArray(nextRound.questions) ? nextRound.questions : [];
    if (!this.isSameJsonValue(previousQuestions, nextQuestions)) {
      throw new BadRequestException('Stored duel questions cannot be changed after creation.');
    }
  }

  private assertAnswersUnchangedForOtherParticipant(
    previousRound: Record<string, unknown>,
    nextRound: Record<string, unknown>,
    answerKey: 'player1Answers' | 'player2Answers'
  ) {
    const previousAnswers = Array.isArray(previousRound[answerKey]) ? previousRound[answerKey] : [];
    const nextAnswers = Array.isArray(nextRound[answerKey]) ? nextRound[answerKey] : [];
    if (!this.isSameJsonValue(previousAnswers, nextAnswers)) {
      throw new BadRequestException('You cannot modify your opponent\'s stored duel answers.');
    }
  }

  private assertAnswersAppendOnly(
    previousRound: Record<string, unknown>,
    nextRound: Record<string, unknown>,
    answerKey: 'player1Answers' | 'player2Answers'
  ) {
    const previousAnswers = Array.isArray(previousRound[answerKey]) ? previousRound[answerKey] : [];
    const nextAnswers = Array.isArray(nextRound[answerKey]) ? nextRound[answerKey] : [];

    if (nextAnswers.length < previousAnswers.length) {
      throw new BadRequestException('Stored duel answers cannot be removed.');
    }

    if (!this.isJsonPrefix(previousAnswers, nextAnswers)) {
      throw new BadRequestException('Stored duel answers cannot be changed retroactively.');
    }
  }

  private isJsonPrefix(previousValues: unknown[], nextValues: unknown[]) {
    for (let index = 0; index < previousValues.length; index += 1) {
      if (!this.isSameJsonValue(previousValues[index], nextValues[index])) {
        return false;
      }
    }
    return true;
  }

  private isSameJsonValue(left: unknown, right: unknown) {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  private resolveWinnerDisplayName(duel: DuelWithRelations, player1Score: number, player2Score: number) {
    if (player1Score > player2Score) {
      return duel.challenger.displayName;
    }
    if (player2Score > player1Score) {
      return duel.opponent.displayName;
    }
    return null;
  }

  private getFallbackCurrentTurn(duel: DuelWithRelations) {
    if (duel.status === DuelStatus.PENDING) {
      return duel.challenger.displayName;
    }
    if (duel.status === DuelStatus.ACTIVE) {
      return duel.challenger.displayName;
    }
    return '';
  }

  private normalizeParticipantName(input: unknown, duel: DuelWithRelations) {
    const candidate = this.readString(input);
    if (!candidate) {
      return null;
    }
    if (candidate === duel.challenger.displayName || candidate === duel.opponent.displayName) {
      return candidate;
    }
    return null;
  }

  private normalizeDifficulty(input: unknown) {
    const value = String(input || '').trim().toLowerCase();
    return ALLOWED_DUEL_DIFFICULTIES.has(value) ? value : 'profi';
  }

  private normalizeCategoryRound(input: unknown, categoryRoundCount: number, status: string) {
    if (status === 'finished') {
      return Math.max(0, Math.min(MAX_DUEL_CATEGORY_ROUNDS - 1, categoryRoundCount - 1));
    }
    return this.normalizeBoundedInteger(input, 0, MAX_DUEL_CATEGORY_ROUNDS - 1, 0);
  }

  private sanitizeText(input: unknown, maxLength: number) {
    return String(input ?? '')
      .trim()
      .slice(0, maxLength);
  }

  private readString(input: unknown) {
    const value = String(input ?? '').trim();
    return value.length > 0 ? value : null;
  }

  private readInteger(input: unknown) {
    if (typeof input === 'number' && Number.isFinite(input)) {
      return Math.trunc(input);
    }
    if (typeof input === 'string' && input.trim().length > 0) {
      const parsed = Number(input);
      if (Number.isFinite(parsed)) {
        return Math.trunc(parsed);
      }
    }
    return null;
  }

  private asRecord(input: unknown): Record<string, unknown> {
    return input && typeof input === 'object' && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  }

  private assertDuelParticipant(
    actor: AuthenticatedUser,
    duel: Pick<DuelWithRelations, 'challengerId' | 'opponentId'>
  ) {
    if (duel.challengerId !== actor.id && duel.opponentId !== actor.id) {
      throw new ForbiddenException('You are not a participant in this duel.');
    }
  }

  private shuffle<T>(values: T[]): T[] {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }
}
