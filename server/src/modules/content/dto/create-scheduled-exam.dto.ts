import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateScheduledExamDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsOptional()
  @IsDateString()
  examDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;
}
