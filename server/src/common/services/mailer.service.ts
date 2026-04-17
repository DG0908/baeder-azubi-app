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

type RetentionWarningMailInput = {
  email: string;
  displayName: string;
  daysUntilDeletion: number;
  loginUrl: string;
};

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(input: PasswordResetMailInput): Promise<void> {
    if (!this.isSmtpConfigured()) {
      this.logger.error(
        `SMTP not configured. Password reset mail for ${input.email} could not be sent.`
      );
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

  async sendRetentionWarningEmail(input: RetentionWarningMailInput): Promise<void> {
    if (!this.isSmtpConfigured()) {
      this.logger.warn(
        `SMTP not configured. Retention warning for ${input.email} could not be sent.`
      );
      return;
    }

    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM'),
        to: input.email,
        subject: 'Azubi-App: Dein Account wird bald geloescht',
        text: [
          `Hallo ${input.displayName},`,
          '',
          'dein Account in der Azubi-App wurde seit ueber 22 Monaten nicht mehr genutzt.',
          `Ohne erneuten Login wird dein Account in ${input.daysUntilDeletion} Tagen automatisch geloescht (DSGVO-Aufbewahrungsfrist).`,
          '',
          `Logge dich jetzt ein, um deinen Account zu behalten: ${input.loginUrl}`,
          '',
          'Wenn du die App nicht mehr nutzen moechtest, brauchst du nichts zu tun.'
        ].join('\n'),
        html: [
          `<p>Hallo ${this.escapeHtml(input.displayName)},</p>`,
          '<p>dein Account in der Azubi-App wurde seit ueber 22 Monaten nicht mehr genutzt.</p>',
          `<p>Ohne erneuten Login wird dein Account in <strong>${input.daysUntilDeletion} Tagen</strong> automatisch geloescht (DSGVO-Aufbewahrungsfrist).</p>`,
          `<p><a href="${this.escapeHtml(input.loginUrl)}">Jetzt einloggen und Account behalten</a></p>`,
          '<p>Wenn du die App nicht mehr nutzen moechtest, brauchst du nichts zu tun.</p>'
        ].join('')
      });

      this.logger.log(`Retention warning email sent to ${input.email}`);
    } catch (error) {
      this.logger.error(
        `Retention warning mail for ${input.email} failed: ${error instanceof Error ? error.message : 'unknown error'}`
      );
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
