import { IsString, MaxLength } from 'class-validator';

export class CreateNewsPostDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @MaxLength(4000)
  content!: string;
}
