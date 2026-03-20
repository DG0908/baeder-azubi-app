import { IsIn } from 'class-validator';
import { FORUM_CATEGORY_IDS } from '../forum-categories';

export class ListForumPostsQueryDto {
  @IsIn(FORUM_CATEGORY_IDS)
  category!: string;
}
