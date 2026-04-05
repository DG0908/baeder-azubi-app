import { IsString, MinLength } from 'class-validator';

export class TotpRegenerateRecoveryCodesDto {
  @IsString()
  @MinLength(1)
  password!: string;
}
