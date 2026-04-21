import { IsString, MaxLength, MinLength } from 'class-validator';

export class SubmitMonthlyReportDto {
  @IsString()
  @MinLength(20)
  @MaxLength(8000)
  content!: string;
}
