import {
  IsArray,
  IsDefined,
  IsInt,
  IsIn,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

const ALLOWED_DIFFICULTIES = ['anfaenger', 'profi', 'experte', 'extra', 'normal'] as const;

/**
 * Metadata-only representation of a category round.
 * Question-/Answer-Arrays are server-authoritative and must go through
 * the dedicated endpoints (POST /duels/:id/rounds, POST /duels/:id/answers).
 * Clients are no longer allowed to send them via PATCH /state.
 */
export class CategoryRoundDto {
  @IsOptional() @IsString()  categoryId?: string;
  @IsOptional() @IsString()  category?: string;
  @IsOptional() @IsString()  categoryName?: string;
  @IsOptional() @IsString()  chooser?: string;
}

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
   * Array of category rounds. Deep structural validation is performed
   * by the service layer; here we only preserve the shape through NestJS.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryRoundDto)
  categoryRounds?: CategoryRoundDto[];

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
