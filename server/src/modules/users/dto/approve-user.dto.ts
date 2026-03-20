import { AccountStatus } from '@prisma/client';
import { IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class ApproveUserDto {
  @IsEnum(AccountStatus)
  @IsIn([AccountStatus.APPROVED, AccountStatus.REJECTED, AccountStatus.DISABLED])
  status!: AccountStatus;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  reason?: string;
}
