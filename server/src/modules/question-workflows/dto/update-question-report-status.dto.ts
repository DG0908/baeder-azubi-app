import { IsIn } from 'class-validator';

export class UpdateQuestionReportStatusDto {
  @IsIn(['open', 'resolved'])
  status!: 'open' | 'resolved';
}
