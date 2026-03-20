import { IsInt, IsObject, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class SaveReportBookDto {
  @IsOptional()
  @IsString()
  entryId?: string;

  @IsString()
  weekStart!: string;

  @IsInt()
  @Min(1)
  @Max(3)
  trainingYear!: number;

  @IsInt()
  @Min(1)
  @Max(500)
  evidenceNumber!: number;

  @IsObject()
  entries!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  apprenticeNote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  trainerNote?: string;

  @IsOptional()
  @IsString()
  @MaxLength(750000)
  apprenticeSignature?: string;

  @IsOptional()
  @IsString()
  @MaxLength(750000)
  trainerSignature?: string;

  @IsOptional()
  @IsString()
  apprenticeSignatureDate?: string;

  @IsOptional()
  @IsString()
  trainerSignatureDate?: string;
}
