import { IsDateString, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateMyProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Matches(/^[a-z0-9_-]+$/i)
  avatar?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  company?: string | null;

  @IsOptional()
  @IsDateString()
  birthDate?: string | null;
}
