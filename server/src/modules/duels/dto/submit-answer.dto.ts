import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export type DuelAnswerType = 'single' | 'keyword' | 'whoami';

export class SubmitAnswerDto {
  @IsString()
  duelQuestionId!: string;

  @IsOptional()
  @IsIn(['single', 'keyword', 'whoami'])
  answerType?: DuelAnswerType;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  selectedOptionIndex?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  keywordText?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(300000)
  durationMs?: number;
}
