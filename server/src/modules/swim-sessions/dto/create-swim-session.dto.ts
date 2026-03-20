import { IsDateString, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateSwimSessionDto {
  @IsDateString()
  date!: string;

  @IsInt()
  @Min(1)
  @Max(200000)
  distanceMeters!: number;

  @IsInt()
  @Min(1)
  @Max(1440)
  timeMinutes!: number;

  @IsString()
  @MaxLength(60)
  styleId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  challengeId?: string;
}
