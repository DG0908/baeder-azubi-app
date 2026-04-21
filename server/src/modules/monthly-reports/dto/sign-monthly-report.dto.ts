import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SignMonthlyReportDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  trainerFeedback?: string;
}
