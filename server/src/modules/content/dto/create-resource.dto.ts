import { IsOptional, IsString, MaxLength } from 'class-validator';
import { IsNoInternalIp } from '../../../common/validators/no-internal-ip.validator';

export class CreateResourceDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description!: string;

  @IsNoInternalIp()
  @IsString()
  @MaxLength(2048)
  url!: string;

  @IsString()
  @MaxLength(50)
  category!: string;
}
