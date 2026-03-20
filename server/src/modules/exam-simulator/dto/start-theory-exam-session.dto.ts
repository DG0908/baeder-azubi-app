import { IsBoolean, IsOptional } from 'class-validator';

export class StartTheoryExamSessionDto {
  @IsOptional()
  @IsBoolean()
  keywordMode?: boolean;
}
