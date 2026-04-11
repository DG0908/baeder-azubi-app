import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService mit Query-Middleware für:
 * - Performance-Logging (langsame Queries > konfigurierbarer Threshold)
 * - Fehlerprotokollierung mit Model/Action-Kontext
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly slowQueryThresholdMs: number;

  constructor(private readonly configService: ConfigService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' }
      ]
    });

    this.slowQueryThresholdMs = Number(
      this.configService.get<number>('PRISMA_SLOW_QUERY_THRESHOLD_MS', 500)
    );
  }

  async onModuleInit() {
    // Query-Middleware für Performance-Monitoring
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).$use(async (params: any, next: any) => {
      const start = Date.now();

      try {
        const result = await next(params);
        const duration = Date.now() - start;

        if (duration > this.slowQueryThresholdMs) {
          this.logger.warn(
            `Slow query: ${params.model}.${params.action} took ${duration}ms`
          );
        }

        return result;
      } catch (error) {
        const duration = Date.now() - start;
        this.logger.error(
          `Query error: ${params.model}.${params.action} after ${duration}ms — ${error instanceof Error ? error.message : 'unknown error'}`
        );
        throw error;
      }
    });

    // Event-Listener für Raw SQL Queries
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).$on('query', (event: { query: string; duration: number }) => {
      if (event.duration > this.slowQueryThresholdMs) {
        this.logger.warn(`Raw SQL slow query took ${event.duration}ms`);
      }
    });

    await this.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
