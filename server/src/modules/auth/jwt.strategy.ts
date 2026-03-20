import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AccountStatus, Prisma } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../../prisma/prisma.service';

type JwtPayload = {
  sub: string;
  tokenType: 'access';
};

const authUserSelect = {
  id: true,
  email: true,
  displayName: true,
  role: true,
  status: true,
  canSignReports: true,
  organizationId: true,
  isDeleted: true
} satisfies Prisma.UserSelect;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid access token.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: authUserSelect
    });

    if (!user || user.isDeleted || user.status === AccountStatus.DISABLED) {
      throw new UnauthorizedException('Account is not available.');
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      status: user.status,
      canSignReports: user.canSignReports,
      organizationId: user.organizationId
    };
  }
}
