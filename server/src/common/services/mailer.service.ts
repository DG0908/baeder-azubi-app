import {
  Injectable,
  Logger,
  ServiceUnavailableException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

type PasswordResetMailInput = {
  email: string;
  displayName: string;
  resetUrl: string;
  expiresInMinutes: number;
};

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(input: PasswordResetMailInput): Promise<void> {
    if (!this.isSmtpConfigured()) {
      if (this.configService.get<string>('NODE_ENV') !== 'production') {
        this.logger.warn(
          `SMTP not configured. Password reset URL for ${input.email}: ${input.resetUrl}`
        );
        return;
      }

      throw new ServiceUnavailableException('Password reset mail service is not configured.');
    }

    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM'),
        to: input.email,
        subject: 'Azubi-App Passwort zuruecksetzen',
        text: [
          `Hallo ${input.displayName},`,
          '',
          'du hast ein neues Passwort fuer die Azubi-App angefordert.',
          `Der Link ist ${input.expiresInMinutes} Minuten gueltig:`,
          input.resetUrl,
          '',
          'Wenn du den Reset nicht angefordert hast, ignoriere diese E-Mail.'
        ].join('\n'),
        html: [
          `<p>Hallo ${this.escapeHtml(input.displayName)},</p>`,
          '<p>du hast ein neues Passwort fuer die Azubi-App angefordert.</p>',
          `<p>Der Link ist <strong>${input.expiresInMinutes} Minuten</strong> gueltig:</p>`,
          `<p><a href="${this.escapeHtml(input.resetUrl)}">${this.escapeHtml(input.resetUrl)}</a></p>`,
          '<p>Wenn du den Reset nicht angefordert hast, ignoriere diese E-Mail.</p>'
        ].join('')
      });
    } catch (error) {
      this.logger.error(
        `Password reset mail could not be sent: ${error instanceof Error ? error.message : 'unknown error'}`
      );
      throw new ServiceUnavailableException('Password reset mail could not be sent.');
    }
  }

  private getTransporter(): Transporter {
    if (this.transporter) {
      return this.transporter;
    }

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: Number(this.configService.get<number>('SMTP_PORT', 587)),
      secure: Boolean(this.configService.get<boolean>('SMTP_SECURE', false)),
      auth: this.configService.get<string>('SMTP_USER')
        ? {
            user: this.configService.get<string>('SMTP_USER'),
            pass: this.configService.get<string>('SMTP_PASSWORD')
          }
        : undefined
    });

    return this.transporter;
  }

  private isSmtpConfigured(): boolean {
    return Boolean(
      String(this.configService.get<string>('SMTP_HOST', '')).trim()
      && String(this.configService.get<string>('SMTP_FROM', '')).trim()
    );
  }

  private escapeHtml(value: string): string {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
