import { IsArray, IsObject } from 'class-validator';

export class UpdateAppConfigDto {
  @IsArray()
  menuItems!: unknown[];

  @IsObject()
  themeColors!: Record<string, unknown>;
}
