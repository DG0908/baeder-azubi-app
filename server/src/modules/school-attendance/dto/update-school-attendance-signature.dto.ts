import { IsEnum, IsOptional, IsString, Matches, ValidateIf } from 'class-validator';

export enum SchoolAttendanceSignatureField {
  TEACHER_SIGNATURE = 'teacherSignature',
  TRAINER_SIGNATURE = 'trainerSignature'
}

export class UpdateSchoolAttendanceSignatureDto {
  @IsEnum(SchoolAttendanceSignatureField)
  field!: SchoolAttendanceSignatureField;

  @IsOptional()
  @ValidateIf((_object, value) => value !== null && value !== undefined)
  @IsString()
  @Matches(/^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/)
  value?: string | null;
}
