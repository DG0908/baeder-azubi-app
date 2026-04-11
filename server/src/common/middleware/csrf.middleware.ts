import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * CSRF-Middleware für state-changing Requests (POST/PUT/PATCH/DELETE).
 *
 * Prüft das Vorhandensein des `X-Requested-With`-Headers.
 * Browser können diesen Header bei cross-origin Requests nicht setzen,
 * ohne dass der Browser einen CORS-Preflight durchführt – den unsere
 * strikte CORS-Konfiguration blockiert.
 *
 * GET/HEAD/OPTIONS-Requests sind von der Prüfung ausgenommen.
 */
const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(request: Request, _response: Response, next: NextFunction) {
    if (!STATE_CHANGING_METHODS.has(request.method.toUpperCase())) {
      next();
      return;
    }

    if (!request.headers['x-requested-with']) {
      throw new ForbiddenException('CSRF validation failed.');
    }

    next();
  }
}
