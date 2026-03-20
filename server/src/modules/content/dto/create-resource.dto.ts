import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description!: string;

  @IsString()
  @MaxLength(2048)
  url!: string;

  @IsString()
  @MaxLength(50)
  category!: string;
}
