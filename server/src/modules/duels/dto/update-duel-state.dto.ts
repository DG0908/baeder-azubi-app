import { IsObject } from 'class-validator';

export class UpdateDuelStateDto {
  @IsObject()
  gameState!: Record<string, unknown>;
}
