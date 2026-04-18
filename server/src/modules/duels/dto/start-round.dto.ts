import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class StartRoundDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  categoryId!: string;
}
