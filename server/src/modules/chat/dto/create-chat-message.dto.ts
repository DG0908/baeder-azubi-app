import { ChatScope } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class CreateChatMessageDto {
  @IsEnum(ChatScope)
  scope!: ChatScope;

  @IsOptional()
  @IsString()
  recipientId?: string;

  @IsString()
  @Length(1, 2000)
  content!: string;
}
