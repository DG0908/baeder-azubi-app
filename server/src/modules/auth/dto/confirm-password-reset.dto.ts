import { IsString, Length, Matches } from 'class-validator';

export class ConfirmPasswordResetDto {
  @IsString()
  @Length(24, 256)
  @Matches(/^[A-Za-z0-9_-]+$/)
  token!: string;

  @IsString()
  @Length(12, 128)
  newPassword!: string;
}
