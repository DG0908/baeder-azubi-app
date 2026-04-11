import {
  IsArray,
  IsDefined,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

const ALLOWED_DIFFICULTIES = ['anfaenger', 'profi', 'experte', 'extra', 'normal'] as const;

export class GameStateDto {
  /** Display name of the player whose turn it is. */
  @IsOptional()
  @IsString()
  currentTurn?: string;

  /** 0-based index of the current category round. */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  categoryRound?: number;

  /**
   * Client-side status label — informational only, server is authoritative.
   * Not restricted to an enum because the frontend derives this from multiple
   * sources (mapDuelStatus returns 'finished', 'waiting', 'active', 'unknown', …).
   */
  @IsOptional()
  @IsString()
  status?: string;

  /** Difficulty chosen for this duel. */
  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_DIFFICULTIES)
  difficulty?: string;

  /**
   * Array of category rounds, each containing questions and answers.
   * Deep structural validation is performed by the service layer.
   */
  @IsOptional()
  @IsArray()
  categoryRounds?: Record<string, unknown>[];

  /** Challenge response timeout in minutes. */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10080)
  challengeTimeoutMinutes?: number;
}

export class UpdateDuelStateDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => GameStateDto)
  gameState!: GameStateDto;
}
