import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { generateSecret, generateURI, verify as totpVerify } from 'otplib';
import * as QRCode from 'qrcode';

@Injectable()
export class TotpService {
  private readonly encryptionKey: Buffer | null;

  constructor(private readonly configService: ConfigService) {
    const raw = String(this.configService.get<string>('APP_TOTP_ENCRYPTION_KEY', '')).trim();
    if (raw.length >= 32) {
      // Derive a stable 32-byte key from the config value via SHA-256
      this.encryptionKey = createHash('sha256').update(raw).digest();
    } else {
      this.encryptionKey = null;
    }
  }

  isConfigured(): boolean {
    return this.encryptionKey !== null;
  }

  generateSecret(): string {
    return generateSecret();
  }

  async generateQrCodeUrl(email: string, secret: string): Promise<string> {
    const otpAuthUrl = generateURI({ secret, label: email, issuer: 'Azubi-App' });
    return QRCode.toDataURL(otpAuthUrl);
  }

  async verifyToken(token: string, secret: string): Promise<boolean> {
    const result = await totpVerify({ token, secret });
    // otplib v13 returns { valid: boolean, ... } or false
    if (!result) return false;
    if (typeof result === 'object' && 'valid' in result) return (result as any).valid === true;
    return Boolean(result);
  }

  encrypt(plaintext: string): string {
    if (!this.encryptionKey) throw new Error('TOTP encryption key not configured.');
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return [iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':');
  }

  decrypt(data: string): string {
    if (!this.encryptionKey) throw new Error('TOTP encryption key not configured.');
    const [ivHex, authTagHex, encryptedHex] = data.split(':');
    const decipher = createDecipheriv('aes-256-gcm', this.encryptionKey, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    return decipher.update(Buffer.from(encryptedHex, 'hex'), undefined, 'utf8') + decipher.final('utf8');
  }
}
