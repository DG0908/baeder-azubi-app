import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { IsNoInternalIp } from '../../../common/validators/no-internal-ip.validator';

export class CreateLearningMaterialDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @MaxLength(64)
  category!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  type?: string;

  @IsOptional()
  @IsNoInternalIp()
  @IsUrl({
    require_tld: true,
    require_protocol: true
  })
  @MaxLength(2000)
  url?: string;
}
