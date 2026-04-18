import { ArrayMaxSize, ArrayMinSize, IsArray, IsString, Matches, MaxLength } from 'class-validator';

export class GrantBadgesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(64, { each: true })
  @Matches(/^[a-z0-9_]+$/, {
    each: true,
    message: 'badgeId darf nur Kleinbuchstaben, Ziffern und Unterstriche enthalten'
  })
  badgeIds!: string[];
}
