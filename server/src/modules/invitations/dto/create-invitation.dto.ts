import { AppRole } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateInvitationDto {
  @IsEnum(AppRole)
  role!: AppRole;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  maxUses?: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
