import { Body, Controller, Get, Post, Param, ParseIntPipe, Patch, Query} from '@nestjs/common';

import { RequestsService } from './requests.service.js';
import { CreateRequestDto } from './dto/create-request.dto.js';
import { UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/api-key.guard.js';
import { UserGuard } from '../auth/user.guard.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { SystemUser } from '../auth/user.js';
import {
  ApiHeader,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';


import { AssignRequestDto } from './dto/assign-request.dto.js';
import { QueryRequestsDto } from './dto/query-requests.dto.js';


@ApiTags('Inquiries')
@ApiSecurity('x-api-key')
@ApiHeader({
  name: 'x-user',
  description: 'User performing the request',
  required: true,
})
@UseGuards(UserGuard, ApiKeyGuard, RolesGuard)

@Controller('inquiries')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
@Roles('admin', 'supervisor', 'asesor')
create(
  @Body() createRequestDto: CreateRequestDto,
  @CurrentUser() user: SystemUser,
) {
  return this.requestsService.create(
    createRequestDto,
    user,
  );
}

  @Get()
@Roles('admin', 'supervisor', 'asesor')
findAll(
  @CurrentUser() user: SystemUser,
  @Query() queryDto: QueryRequestsDto,
) {
  return this.requestsService.findAll(
    user,
    queryDto,
  );
}
@Get(':id')
@Roles('admin', 'supervisor', 'asesor')
findOne(
  @Param('id', ParseIntPipe) id: number,
  @CurrentUser() user: SystemUser,
) {
  return this.requestsService.findOne(id, user);
}
@Patch(':id/estado')
@Roles('admin', 'supervisor', 'asesor')
updateStatus(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateStatusDto: UpdateStatusDto,
  @CurrentUser() user: SystemUser,
) {
  return this.requestsService.updateStatus(
    id,
    updateStatusDto,
    user,
  );
}
@Patch(':id/assignment')
@Roles('admin', 'supervisor')
assign(
  @Param('id', ParseIntPipe) id: number,
  @Body() assignRequestDto: AssignRequestDto,
  @CurrentUser() user: SystemUser,
) {
  return this.requestsService.assign(
    id,
    assignRequestDto,
    user,
  );
}
@Get(':id/history')
@Roles('admin', 'supervisor', 'asesor')
findHistory(
  @Param('id', ParseIntPipe) id: number,
  @CurrentUser() user: SystemUser,
) {
  return this.requestsService.findHistory(
    id,
    user,
  );
}

}


