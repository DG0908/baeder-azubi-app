import { IsObject } from 'class-validator';

/**
 * featureOverrides entries:
 *  - true  -> force-on
 *  - false -> force-off
 *  - null  -> remove override, back to default behaviour
 */
export class UpdateFeatureOverridesDto {
  @IsObject()
  featureOverrides!: Record<string, boolean | null>;
}
