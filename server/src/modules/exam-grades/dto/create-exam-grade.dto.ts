import { IsDateString, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateExamGradeDto {
  @IsDateString()
  date!: string;

  @IsString()
  @Length(1, 120)
  subject!: string;

  @IsString()
  @Length(1, 200)
  topic!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(6)
  grade!: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string | null;
}
