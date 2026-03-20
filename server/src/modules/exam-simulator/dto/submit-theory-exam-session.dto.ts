import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitTheoryExamAnswerDto {
  @IsString()
  @MaxLength(64)
  questionId!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  selectedAnswerIndex?: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(12)
  @IsInt({ each: true })
  @Min(0, { each: true })
  selectedAnswerIndices?: number[];

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  keywordText?: string;
}

export class SubmitTheoryExamSessionDto {
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => SubmitTheoryExamAnswerDto)
  answers!: SubmitTheoryExamAnswerDto[];

  @IsInt()
  @Min(0)
  @Max(43_200_000)
  timeMs!: number;
}
