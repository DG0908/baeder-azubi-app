import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
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
}
