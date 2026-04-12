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
import { Transform, Type } from 'class-transformer';

const ALLOWED_DIFFICULTIES = ['anfaenger', 'profi', 'experte', 'extra', 'normal'] as const;

/**
 * Represents a single category round as sent by the client.
 * All fields are optional and loosely typed — deep validation is done
 * by the service layer. We declare every expected field here so that
 * NestJS's whitelist does not strip them.
 */
export class CategoryRoundDto {
  @IsOptional() @IsString()  categoryId?: string;
  @IsOptional() @IsString()  category?: string;
  @IsOptional() @IsString()  categoryName?: string;
  @IsOptional() @IsString()  chooser?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value)
  questions?: unknown[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value)
  player1Answers?: unknown[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value)
  player2Answers?: unknown[];
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
