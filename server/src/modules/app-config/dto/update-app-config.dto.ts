import { IsArray, IsObject, IsOptional } from 'class-validator';

export class UpdateAppConfigDto {
  @IsOptional()
  @IsArray()
  menuItems?: unknown[];

  @IsOptional()
  @IsObject()
  themeColors?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  featureFlags?: Record<string, unknown>;
}
