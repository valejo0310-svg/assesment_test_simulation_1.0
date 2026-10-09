import { Body, Controller, Get, Post, Param, ParseIntPipe, Patch} from '@nestjs/common';

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
) {
  return this.requestsService.findAll(user);
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


}


