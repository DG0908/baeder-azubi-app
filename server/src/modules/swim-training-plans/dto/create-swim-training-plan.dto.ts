import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator';

const TRAINING_CATEGORIES = ['ausdauer', 'sprint', 'technik', 'kombi'] as const;
const TRAINING_DIFFICULTIES = ['angenehm', 'fokussiert', 'anspruchsvoll'] as const;

class SwimTrainingPlanUnitDto {
  @IsString()
  @MaxLength(64)
  id!: string;

  @IsString()
  @MaxLength(64)
  styleId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(100)
  targetDistance!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetTime!: number;
}

export class CreateSwimTrainingPlanDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsString()
  @IsIn(TRAINING_CATEGORIES)
  category!: string;

  @IsString()
  @IsIn(TRAINING_DIFFICULTIES)
  difficulty!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SwimTrainingPlanUnitDto)
  units!: SwimTrainingPlanUnitDto[];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  xpReward!: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  assignedUserId?: string;
}
