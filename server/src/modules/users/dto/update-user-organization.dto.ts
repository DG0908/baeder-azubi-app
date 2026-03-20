import { IsOptional, IsString } from 'class-validator';

export class UpdateUserOrganizationDto {
  @IsOptional()
  @IsString()
  organizationId?: string | null;
}
