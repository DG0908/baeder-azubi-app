import { IsDateString, IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';
import { IsPasswordComplex } from '../../../common/validators/password-complexity.validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(2, 100)
  displayName!: string;

  @IsPasswordComplex()
  password!: string;

  @IsString()
  @Matches(/^[A-Z0-9-]{8,64}$/i)
  invitationCode!: string;

  @IsOptional()
  @IsDateString()
  trainingEnd?: string;
}
