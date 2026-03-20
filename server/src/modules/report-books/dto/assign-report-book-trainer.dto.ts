import { IsString } from 'class-validator';

export class AssignReportBookTrainerDto {
  @IsString()
  trainerId!: string;
}
