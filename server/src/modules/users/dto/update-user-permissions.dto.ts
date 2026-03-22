import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserPermissionsDto {
  @IsOptional()
  @IsBoolean()
  canSignReports?: boolean;

  @IsOptional()
  @IsBoolean()
  canViewSchoolCards?: boolean;

  @IsOptional()
  @IsBoolean()
  canViewExamGrades?: boolean;
}
