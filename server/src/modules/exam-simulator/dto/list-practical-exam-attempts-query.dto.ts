import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class ListPracticalExamAttemptsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  userId?: string;

  @IsOptional()
  @IsIn(['zwischen', 'abschluss'])
  examType?: 'zwischen' | 'abschluss';
}
