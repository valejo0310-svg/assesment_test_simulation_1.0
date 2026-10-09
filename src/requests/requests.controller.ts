import { Body, Controller, Get, Post } from '@nestjs/common';

import { RequestsService } from './requests.service.js';
import { CreateRequestDto } from './dto/create-request.dto.js';

@Controller('Inquiries')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.create(createRequestDto);
  }

  @Get()
  findAll() {
    return this.requestsService.findAll();
  }
}