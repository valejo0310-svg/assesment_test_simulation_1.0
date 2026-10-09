import {BadRequestException, ConflictException,Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Request, RequestStatus } from './entities/request.entity.js';
import { CreateRequestDto } from './dto/create-request.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

import { USERS } from '../auth/user.js';
import type { SystemUser } from '../auth/user.js';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestsRepository: Repository<Request>,
  ) {}

  async create(
  createRequestDto: CreateRequestDto,
  user: SystemUser,
) {
  let asesor: string;

  if (user.role === 'asesor') {
    asesor = user.username;
  } else {
    if (!createRequestDto.asesor) {
      throw new BadRequestException(
        'An asesor must be assigned',
      );
    }

    const assignedUser = USERS.find(
      (systemUser) =>
        systemUser.username === createRequestDto.asesor &&
        systemUser.role === 'asesor',
    );

    if (!assignedUser) {
      throw new BadRequestException(
        'The assigned asesor is invalid',
      );
    }

    asesor = assignedUser.username;
  }

  const request = this.requestsRepository.create({
    cliente: createRequestDto.cliente,
    descripcion: createRequestDto.descripcion,
    asesor,
    estado: RequestStatus.PENDING,
  });

  return this.requestsRepository.save(request);
}

  async findAll(user: SystemUser) {
  if (user.role === 'asesor') {
    return this.requestsRepository.find({
      where: {
        asesor: user.username,
      },
    });
  }

  return this.requestsRepository.find();
}
async findOne(
  id: number,
  user: SystemUser,
) {
  const request =
    user.role === 'asesor'
      ? await this.requestsRepository.findOne({
          where: {
            id,
            asesor: user.username,
          },
        })
      : await this.requestsRepository.findOne({
          where: { id },
        });

  if (!request) {
    throw new NotFoundException(
      'Inquiry not found',
    );
  }

  return request;
}

async updateStatus(
  id: number,
  updateStatusDto: UpdateStatusDto,
  user: SystemUser,
) {
  const request = await this.findOne(id, user);

  const currentStatus = request.estado;
  const newStatus = updateStatusDto.estado;

  const validTransition =
    (currentStatus === RequestStatus.PENDING &&
      newStatus === RequestStatus.IN_PROGRESS) ||
    (currentStatus === RequestStatus.IN_PROGRESS &&
      newStatus === RequestStatus.RESOLVED);

  if (!validTransition) {
    throw new ConflictException(
      `Invalid status transition from ${currentStatus} to ${newStatus}`,
    );
  }

  request.estado = newStatus;

  return this.requestsRepository.save(request);
}
}