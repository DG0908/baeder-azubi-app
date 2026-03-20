import { ArrayMaxSize, IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateQuestionReportDto {
  @IsString()
  @MaxLength(191)
  questionKey!: string;

  @IsString()
  @MaxLength(2000)
  questionText!: string;

  @IsString()
  @MaxLength(64)
  category!: string;

  @IsString()
  @MaxLength(64)
  source!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  answers?: string[];
}
