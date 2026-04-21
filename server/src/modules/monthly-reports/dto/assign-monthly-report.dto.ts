import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class AssignMonthlyReportDto {
  @IsString()
  azubiId!: string;

  @IsInt()
  @Min(2000)
  @Max(2100)
  year!: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  activity!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  activityDescription?: string;
}
