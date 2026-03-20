import { IsOptional, IsString } from 'class-validator';

export class ListSchoolAttendanceQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;
}
