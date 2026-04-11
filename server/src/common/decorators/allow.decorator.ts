import { SetMetadata } from '@nestjs/common';

export const ALLOW_KEY = 'allow';

/**
 * Markiert einen Endpunkt als explizit für **alle authentifizierten Benutzer** freigegeben.
 *
 * Verwendung: Nur für Self-Service-Endpoints, bei denen der User ausschließlich
 * eigene Daten liest/schreibt (z. B. `GET /users/me`, `POST /duels`).
 *
 * Der `JwtAuthGuard` stellt sicher, dass der Benutzer authentifiziert ist.
 * Der `ApprovedGuard` stellt sicher, dass der Account freigeschaltet ist.
 * Der `RolesGuard` erlaubt den Zugriff, wenn `@Allow()` gesetzt ist.
 */
export const Allow = () => SetMetadata(ALLOW_KEY, true);
