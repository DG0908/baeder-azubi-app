import { IsBoolean } from 'class-validator';

export class UpdateBetaTesterDto {
  @IsBoolean()
  isBetaTester!: boolean;
}
