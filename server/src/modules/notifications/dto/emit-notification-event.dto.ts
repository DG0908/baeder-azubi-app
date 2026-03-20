import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

export enum NotificationEventType {
  SCHOOL_ATTENDANCE_CREATED = 'SCHOOL_ATTENDANCE_CREATED',
  EXAM_GRADE_CREATED = 'EXAM_GRADE_CREATED',
  BERICHTSHEFT_READY_FOR_REVIEW = 'BERICHTSHEFT_READY_FOR_REVIEW',
  SWIM_SESSION_PENDING = 'SWIM_SESSION_PENDING',
  SWIM_PLAN_ASSIGNED = 'SWIM_PLAN_ASSIGNED',
  NEWS_PUBLISHED = 'NEWS_PUBLISHED',
  EXAM_CREATED = 'EXAM_CREATED'
}

export class EmitNotificationEventDto {
  @IsEnum(NotificationEventType)
  eventType!: NotificationEventType;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  targetUserIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  excludeUserIds?: string[];

  @IsOptional()
  @IsString()
  @Length(1, 120)
  subject?: string;

  @IsOptional()
  @IsString()
  @Length(1, 40)
  schoolDate?: string;

  @IsOptional()
  @IsString()
  @Length(1, 40)
  examDate?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  gradeLabel?: string;

  @IsOptional()
  @IsString()
  @Length(1, 40)
  weekStart?: string;

  @IsOptional()
  @IsString()
  @Length(1, 40)
  sessionDate?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  sessionDistanceMeters?: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  sessionStyleName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 160)
  planName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 160)
  planUnitLabel?: string;

  @IsOptional()
  @IsString()
  @Length(1, 160)
  newsTitle?: string;

  @IsOptional()
  @IsString()
  @Length(1, 160)
  examTitle?: string;
}
