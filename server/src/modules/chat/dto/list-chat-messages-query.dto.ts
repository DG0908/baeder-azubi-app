import { ChatScope } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

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
}
