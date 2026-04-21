import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min
} from 'class-validator';

export class CreateSubmittedQuestionDto {
  @IsString()
  @MaxLength(64)
  category!: string;

  @IsString()
  @MaxLength(2000)
  question!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  answers!: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  correct?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @IsInt({ each: true })
  @Min(0, { each: true })
  correctIndices?: number[];

  @IsOptional()
  @IsBoolean()
  multi?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['multiple', 'whoami'])
  type?: 'multiple' | 'whoami';

  @IsOptional()
  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @MaxLength(300, { each: true })
  clues?: string[];
}
