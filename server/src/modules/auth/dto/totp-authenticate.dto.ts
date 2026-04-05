import { IsString, Length } from 'class-validator';

export class TotpAuthenticateDto {
  @IsString()
  totpToken!: string;

  @IsString()
  @Length(6, 6)
  code!: string;
}
