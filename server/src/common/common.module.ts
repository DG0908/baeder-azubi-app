import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CsrfMiddleware } from './middleware/csrf.middleware';

@Module({})
export class CommonModule implements NestModule
{
  configure(consumer: MiddlewareConsumer) {
    // CSRF-Schutz auf ALLE state-changing Endpunkte anwenden.
    // Die Middleware prüft intern, ob die Methode POST/PUT/PATCH/DELETE ist.
    consumer
      .apply(CsrfMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
