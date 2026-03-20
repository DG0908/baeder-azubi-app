import { IsString, MaxLength } from 'class-validator';

export class CreateForumReplyDto {
  @IsString()
  @MaxLength(4000)
  content!: string;
}
