import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { Allow } from '../../common/decorators/allow.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { AdminResetPasswordDto } from './dto/admin-reset-password.dto';
import { ApproveUserDto } from './dto/approve-user.dto';
import { VerifyParentalConsentDto } from './dto/verify-parental-consent.dto';
import { UpdateAvatarUnlocksDto } from './dto/update-avatar-unlocks.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateUserOrganizationDto } from './dto/update-user-organization.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Allow()
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getCurrentUser(user);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 30 } })
  @Patch('me')
  updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateMyProfileDto,
    @Req() request: Request
  ) {
    return this.usersService.updateCurrentUser(user, dto, request);
  }

  @Allow()
  @Get('contacts')
  contacts(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.listOrganizationContacts(user);
  }

  @Allow()
  @Get('me/export')
  exportMe(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request
  ) {
    return this.usersService.exportUserData(user, user.id, request);
  }

  @Roles(AppRole.ADMIN)
  @Get()
  list() {
    return this.usersService.listAllUsers();
  }

  @Roles(AppRole.ADMIN)
  @Get('pending')
  pending() {
    return this.usersService.listPendingUsers();
  }

  @Roles(AppRole.ADMIN)
  @Patch(':id/approval')
  approval(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') userId: string,
    @Body() dto: ApproveUserDto,
    @Req() request: Request
  ) {
    return this.usersService.updateApproval(actor, userId, dto, request);
  }

  @Roles(AppRole.ADMIN)
  @Patch(':id/role')
  role(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') userId: string,
    @Body() dto: UpdateUserRoleDto,
    @Req() request: Request
  ) {
    return this.usersService.updateRole(actor, userId, dto, request);
  }

  @Roles(AppRole.ADMIN)
  @Patch(':id/organization')
  organization(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') userId: string,
    @Body() dto: UpdateUserOrganizationDto,
    @Req() request: Request
  ) {
    return this.usersService.updateOrganization(actor, userId, dto.organizationId ?? null, request);
  }

  @Roles(AppRole.ADMIN)
  @Patch(':id/permissions')
  permissions(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') userId: string,
    @Body() dto: UpdateUserPermissionsDto,
    @Req() request: Request
  ) {
    return this.usersService.updatePermissions(actor, userId, dto, request);
  }

  @Roles(AppRole.ADMIN)
  @Patch(':id/password')
  resetPassword(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') userId: string,
    @Body() dto: AdminResetPasswordDto,
    @Req() request: Request
  ) {
    return this.usersService.adminResetPassword(actor, userId, dto.newPassword, request);
  }

  @Roles(AppRole.ADMIN)
  @Get(':id/export')
  exportUser(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') userId: string,
    @Req() request: Request
  ) {
    return this.usersService.exportUserData(actor, userId, request);
  }

  @Allow()
  @Throttle({ default: { ttl: 600000, limit: 3 } })
  @Delete('me')
  deleteSelf(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request
  ) {
    return this.usersService.deleteSelf(user, request);
  }

  @Roles(AppRole.ADMIN)
  @Patch(':id/parental-consent')
  parentalConsent(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') userId: string,
    @Body() dto: VerifyParentalConsentDto,
    @Req() request: Request
  ) {
    return this.usersService.verifyParentalConsent(actor, userId, dto, request);
  }

  @Roles(AppRole.ADMIN)
  @Post(':id/avatar-unlocks')
  avatarUnlocks(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') userId: string,
    @Body() dto: UpdateAvatarUnlocksDto,
    @Req() request: Request
  ) {
    return this.usersService.updateAvatarUnlocks(actor, userId, dto, request);
  }

  @Roles(AppRole.ADMIN)
  @Delete(':id')
  remove(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') userId: string,
    @Req() request: Request
  ) {
    return this.usersService.softDeleteUser(actor, userId, request);
  }
}
