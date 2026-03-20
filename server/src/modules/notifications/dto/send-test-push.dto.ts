import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum PushTestTargetScope {
  SELF = 'self',
  ORGANIZATION = 'organization'
}

export class SendTestPushDto {
  @IsOptional()
  @IsEnum(PushTestTargetScope)
  targetScope?: PushTestTargetScope = PushTestTargetScope.SELF;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(120)
  delaySeconds?: number = 0;
}
