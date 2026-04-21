import { MonthlyReportStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListMonthlyReportsQueryDto {
  @IsOptional()
  @IsString()
  azubiId?: string;

  @IsOptional()
  @IsEnum(MonthlyReportStatus)
  status?: MonthlyReportStatus;

  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null || value === '' ? undefined : Number(value)))
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;
}
