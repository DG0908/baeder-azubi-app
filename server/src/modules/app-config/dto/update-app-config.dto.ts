import { IsArray, IsObject, IsOptional } from 'class-validator';

export class UpdateAppConfigDto {
  @IsArray()
  menuItems!: unknown[];

  @IsObject()
  themeColors!: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  featureFlags?: Record<string, unknown>;
}
