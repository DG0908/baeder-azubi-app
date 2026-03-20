import { IsDateString, IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(2, 100)
  displayName!: string;

  @IsString()
  @Length(12, 128)
  password!: string;

  @IsString()
  @Matches(/^[A-Z0-9-]{8,64}$/i)
  invitationCode!: string;

  @IsOptional()
  @IsDateString()
  trainingEnd?: string;
}
