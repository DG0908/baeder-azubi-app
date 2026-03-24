import { Body, Controller, Delete, Get, Param, Patch, Req } from '@nestjs/common';
import { AppRole } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { ApproveUserDto } from './dto/approve-user.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateUserOrganizationDto } from './dto/update-user-organization.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getCurrentUser(user);
  }

  @Patch('me')
  updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateMyProfileDto,
    @Req() request: Request
  ) {
    return this.usersService.updateCurrentUser(user, dto, request);
  }

  @Get('contacts')
  contacts(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.listOrganizationContacts(user);
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

  @Delete('me')
  deleteSelf(
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: Request
  ) {
    return this.usersService.deleteSelf(user, request);
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
