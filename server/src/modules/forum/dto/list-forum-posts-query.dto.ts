import { IsIn, IsInt, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';
import { FORUM_CATEGORY_IDS } from '../forum-categories';

export class ListForumPostsQueryDto {
  @IsIn(FORUM_CATEGORY_IDS)
  category!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  /** Cursor ist die ID des zuletzt gelesenen Posts. Wenn gesetzt, wird Cursor-Pagination aktiviert. */
  @IsOptional()
  @IsString()
  @Length(1, 64)
  @Matches(/^[A-Za-z0-9_-]+$/)
  cursor?: string;
}
