import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePracticalExamAttemptDto {
  @IsIn(['zwischen', 'abschluss'])
  examType!: 'zwischen' | 'abschluss';

  @IsOptional()
  @IsString()
  @MaxLength(64)
  userId?: string;

  @IsObject()
  inputValues!: Record<string, string>;
}
