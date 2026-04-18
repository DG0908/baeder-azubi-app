import { IsString, IsUrl, MaxLength } from 'class-validator';
import { IsNoInternalIp } from '../../../common/validators/no-internal-ip.validator';

export class RemovePushSubscriptionDto {
  @IsNoInternalIp()
  @IsUrl({
    require_tld: false,
    require_protocol: true,
    protocols: ['https']
  })
  @MaxLength(2048)
  endpoint!: string;
}
