import { ChatScope } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';

export class ListChatMessagesQueryDto {
  @IsOptional()
  @IsEnum(ChatScope)
  scope?: ChatScope;

  @IsOptional()
  @IsString()
  recipientId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  /** Cursor ist die ID des zuletzt gelesenen Messages. Wenn gesetzt, wird Cursor-Pagination aktiviert. */
  @IsOptional()
  @IsString()
  @Length(1, 64)
  @Matches(/^[A-Za-z0-9_-]+$/)
  cursor?: string;
}
