import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ListTheoryExamAttemptsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  userId?: string;
}
