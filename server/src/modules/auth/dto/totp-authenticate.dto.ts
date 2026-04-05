import { IsOptional, IsString, Length, ValidateIf } from 'class-validator';

export class TotpAuthenticateDto {
  @IsString()
  totpToken!: string;

  @ValidateIf((dto) => !dto.recoveryCode)
  @IsString()
  @Length(6, 6)
  @IsOptional()
  code?: string;

  @ValidateIf((dto) => !dto.code)
  @IsString()
  @Length(6, 32)
  @IsOptional()
  recoveryCode?: string;
}
