import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Request, RequestStatus } from './entities/request.entity.js';
import { CreateRequestDto } from './dto/create-request.dto.js';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestsRepository: Repository<Request>,
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    const request = this.requestsRepository.create({
      ...createRequestDto,
      asesor: 'temporal',
      estado: RequestStatus.PENDING,
    });

    return this.requestsRepository.save(request);
  }

  async findAll() {
    return this.requestsRepository.find();
  }
}