import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsString, MaxLength, Min } from 'class-validator';

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

  @IsInt()
  @Min(0)
  correct!: number;
}
