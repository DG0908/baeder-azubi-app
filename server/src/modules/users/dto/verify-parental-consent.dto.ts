import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ParentalConsentStatus } from '@prisma/client';

export class VerifyParentalConsentDto {
  @IsEnum(ParentalConsentStatus)
  status!: ParentalConsentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
