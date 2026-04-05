import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from '../../common/common.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { TotpService } from './totp.service';

@Module({
  imports: [PassportModule, JwtModule.register({}), CommonModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TotpService],
  exports: [AuthService, TotpService]
})
export class AuthModule {}
