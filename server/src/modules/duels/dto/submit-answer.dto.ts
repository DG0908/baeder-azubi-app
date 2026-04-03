import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  duelQuestionId!: string;

  @IsInt()
  @Min(0)
  @Max(20)
  selectedOptionIndex!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(300000)
  durationMs?: number;
}
