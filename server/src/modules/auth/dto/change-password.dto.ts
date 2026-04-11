import { IsString, Length } from 'class-validator';
import { IsPasswordComplex } from '../../../common/validators/password-complexity.validator';

export class ChangePasswordDto {
  @IsString()
  @Length(1, 128)
  currentPassword!: string;

  @IsPasswordComplex()
  newPassword!: string;
}
