import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListExamGradesQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
