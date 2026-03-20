import { IsString, MaxLength } from 'class-validator';

export class CreateFlashcardDto {
  @IsString()
  @MaxLength(64)
  category!: string;

  @IsString()
  @MaxLength(1000)
  question!: string;

  @IsString()
  @MaxLength(4000)
  answer!: string;
}
