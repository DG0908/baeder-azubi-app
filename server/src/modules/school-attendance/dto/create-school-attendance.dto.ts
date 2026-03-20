import { IsDateString, IsString, Matches } from 'class-validator';

export class CreateSchoolAttendanceDto {
  @IsDateString()
  date!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  startTime!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  endTime!: string;
}
