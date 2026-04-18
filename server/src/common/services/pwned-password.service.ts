import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';

const HIBP_RANGE_ENDPOINT = 'https://api.pwnedpasswords.com/range';
const REQUEST_TIMEOUT_MS = 3000;
const MIN_BREACH_THRESHOLD = 1;

@Injectable()
export class PwnedPasswordService {
  private readonly logger = new Logger(PwnedPasswordService.name);

  async isPwned(password: string): Promise<{ pwned: boolean; count: number; checked: boolean }> {
    if (typeof password !== 'string' || password.length === 0) {
      return { pwned: false, count: 0, checked: false };
    }

    const sha1 = createHash('sha1').update(password, 'utf8').digest('hex').toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${HIBP_RANGE_ENDPOINT}/${prefix}`, {
        headers: { 'Add-Padding': 'true', 'User-Agent': 'baeder-azubi-app' },
        signal: controller.signal,
      });

      if (!response.ok) {
        this.logger.warn(`HIBP responded with status ${response.status} — skipping pwned check (fail-open).`);
        return { pwned: false, count: 0, checked: false };
      }

      const body = await response.text();
      const match = body
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find((line) => line.toUpperCase().startsWith(`${suffix}:`));

      if (!match) {
        return { pwned: false, count: 0, checked: true };
      }

      const rawCount = Number.parseInt(match.split(':')[1] ?? '0', 10);
      const count = Number.isFinite(rawCount) ? rawCount : 0;
      return { pwned: count >= MIN_BREACH_THRESHOLD, count, checked: true };
    } catch (err) {
      this.logger.warn(`HIBP lookup failed (${(err as Error).message}) — fail-open.`);
      return { pwned: false, count: 0, checked: false };
    } finally {
      clearTimeout(timer);
    }
  }
}
