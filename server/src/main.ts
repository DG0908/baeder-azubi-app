import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const corsOrigins = String(config.get<string>('APP_CORS_ORIGINS', ''))
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const normalizeOrigin = (value: string) => String(value || '').trim().replace(/\/+$/, '');

  const isAllowedOrigin = (origin: string | undefined) => {
    if (!origin || corsOrigins.length === 0) {
      return true;
    }

    const normalizedOrigin = normalizeOrigin(origin);

    return corsOrigins.some((allowedOrigin) => {
      const normalizedAllowedOrigin = normalizeOrigin(allowedOrigin);
      if (!normalizedAllowedOrigin) {
        return false;
      }

      if (normalizedAllowedOrigin === '*' || normalizedAllowedOrigin === normalizedOrigin) {
        return true;
      }

      const wildcardMatch = normalizedAllowedOrigin.match(/^(https?):\/\/\*\.(.+)$/i);
      if (!wildcardMatch) {
        return false;
      }

      try {
        const originUrl = new URL(normalizedOrigin);
        const allowedProtocol = wildcardMatch[1].toLowerCase();
        const allowedHostSuffix = wildcardMatch[2].toLowerCase();
        const originProtocol = originUrl.protocol.replace(':', '').toLowerCase();
        const originHost = originUrl.hostname.toLowerCase();

        return originProtocol === allowedProtocol && originHost.endsWith(`.${allowedHostSuffix}`);
      } catch {
        return false;
      }
    });
  };

  // Trust Traefik reverse proxy so rate limiting uses the real client IP
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.setGlobalPrefix('api');
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'", 'https:', 'data:'],
          connectSrc: ["'self'", ...corsOrigins],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"]
        }
      }
    })
  );
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true
  });

  const port = Number(config.get<number>('APP_PORT', 3000));
  await app.listen(port, '0.0.0.0');
  logger.log(`Azubi-App server listening on port ${port}`);
}

void bootstrap();
