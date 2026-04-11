import { IsString, Length, Matches } from 'class-validator';
import { IsPasswordComplex } from '../../../common/validators/password-complexity.validator';

export class ConfirmPasswordResetDto {
  @IsString()
  @Length(24, 256)
  @Matches(/^[A-Za-z0-9_-]+$/)
  token!: string;

  @IsPasswordComplex()
  newPassword!: string;
}
