import { ArrayMaxSize, IsArray, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateAvatarUnlocksDto {
  @IsArray()
  @ArrayMaxSize(200)
  @IsString({ each: true })
  @Matches(/^[a-z0-9_-]+$/i, { each: true })
  @MaxLength(120, { each: true })
  avatarIds: string[];
}
