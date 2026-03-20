import { ReportBookStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListReportBooksQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(ReportBookStatus)
  status?: ReportBookStatus;

  @IsOptional()
  @IsString()
  weekStart?: string;
}
