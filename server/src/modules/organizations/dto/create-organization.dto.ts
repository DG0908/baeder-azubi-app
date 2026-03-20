import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @Length(2, 150)
  name!: string;

  @IsString()
  @Length(2, 80)
  @Matches(/^[a-z0-9-]+$/)
  slug!: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  contactName?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;
}
