import { IsOptional, IsString } from 'class-validator';

export class ListExamGradesQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;
}
