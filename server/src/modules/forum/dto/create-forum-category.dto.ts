import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export const FORUM_CUSTOM_COLOR_KEYS = [
  'slate',
  'blue',
  'cyan',
  'teal',
  'emerald',
  'amber',
  'orange',
  'rose',
  'pink',
  'purple',
  'indigo',
  'violet'
] as const;

export type ForumCustomColorKey = (typeof FORUM_CUSTOM_COLOR_KEYS)[number];

export class CreateForumCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  slug!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(48)
  name!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(8)
  icon!: string;

  @IsOptional()
  @IsString()
  @IsIn(FORUM_CUSTOM_COLOR_KEYS as unknown as string[])
  colorKey?: ForumCustomColorKey;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  description?: string;
}
