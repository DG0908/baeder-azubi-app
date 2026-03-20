import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateDuelDto {
  @IsString()
  opponentId!: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(10080)
  requestTimeoutMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(3)
  @Max(20)
  questionCount?: number;

  @IsOptional()
  @IsString()
  category?: string;
}
