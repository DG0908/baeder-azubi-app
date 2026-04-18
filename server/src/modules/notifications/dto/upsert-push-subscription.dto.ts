import { IsOptional, IsString, IsUrl, Length, MaxLength } from 'class-validator';
import { IsNoInternalIp } from '../../../common/validators/no-internal-ip.validator';

export class UpsertPushSubscriptionDto {
  @IsNoInternalIp()
  @IsUrl({
    require_tld: false,
    require_protocol: true,
    protocols: ['https']
  })
  @MaxLength(2048)
  endpoint!: string;

  @IsString()
  @Length(16, 512)
  p256dh!: string;

  @IsString()
  @Length(16, 512)
  auth!: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  userAgent?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  deviceLabel?: string;
}
