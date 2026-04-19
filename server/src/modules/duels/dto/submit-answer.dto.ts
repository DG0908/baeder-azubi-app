import { ArrayMaxSize, IsArray, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export type DuelAnswerType = 'single' | 'multi' | 'keyword' | 'whoami';

export class SubmitAnswerDto {
  @IsString()
  duelQuestionId!: string;

  @IsOptional()
  @IsIn(['single', 'multi', 'keyword', 'whoami'])
  answerType?: DuelAnswerType;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  selectedOptionIndex?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(20, { each: true })
  selectedOptionIndices?: number[];

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
