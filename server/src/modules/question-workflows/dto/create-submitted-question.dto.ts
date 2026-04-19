import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
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
  @ArrayMinSize(4)
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
}
