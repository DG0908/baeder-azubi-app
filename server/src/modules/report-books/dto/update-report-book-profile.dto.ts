import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateReportBookProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  vorname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  nachname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  ausbildungsbetrieb?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  ausbildungsberuf?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  ausbilder?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  ausbildungsbeginn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  ausbildungsende?: string;
}
