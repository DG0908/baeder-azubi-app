import { IsIn, IsString, MaxLength } from 'class-validator';
import { FORUM_CATEGORY_IDS } from '../forum-categories';

export class CreateForumPostDto {
  @IsIn(FORUM_CATEGORY_IDS)
  category!: string;

  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @MaxLength(6000)
  content!: string;
}
