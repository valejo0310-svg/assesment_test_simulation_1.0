import {BadRequestException, ConflictException,Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Request, RequestStatus } from './entities/request.entity.js';
import { CreateRequestDto } from './dto/create-request.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

import { USERS } from '../auth/user.js';
import type { SystemUser } from '../auth/user.js';

import { DataSource, Repository } from 'typeorm';
import {
  HistoryEventType,
  RequestHistory,
} from './entities/request-history.entity.js';

import { AssignRequestDto } from './dto/assign-request.dto.js';

import { QueryRequestsDto } from './dto/query-requests.dto.js';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestsRepository: Repository<Request>,
    private readonly dataSource: DataSource,  
  ) {}

  async create(
  createRequestDto: CreateRequestDto,
  user: SystemUser,
) {
  return this.dataSource.transaction(
    async (manager) => {
      const requestRepository =
        manager.getRepository(Request);

      const historyRepository =
        manager.getRepository(RequestHistory);

      const asesor =
        user.role === 'asesor'
          ? user.username
          : null;

      const request =
        requestRepository.create({
          cliente: createRequestDto.cliente,
          descripcion: createRequestDto.descripcion,
          asesor,
          estado: RequestStatus.PENDING,
        });

      const savedRequest =
        await requestRepository.save(request);

      const history =
        historyRepository.create({
          solicitudId: savedRequest.id,
          tipoEvento: HistoryEventType.CREATION,
          valorAnterior: null,
          valorNuevo: RequestStatus.PENDING,
          usuarioActor: user.username,
        });

      await historyRepository.save(history);

      return savedRequest;
    },
  );
}

  async findAll(
  user: SystemUser,
  queryDto: QueryRequestsDto,
) {
  const {
    estado,
    asesor,
    cliente,
    desde,
    hasta,
    page = 1,
    limit = 10,
  } = queryDto;

  if (
    desde &&
    hasta &&
    new Date(desde) > new Date(hasta)
  ) {
    throw new BadRequestException(
      'The start date cannot be later than the end date',
    );
  }

  const query =
    this.requestsRepository.createQueryBuilder(
      'request',
    );

  // Un asesor SOLO puede consultar lo suyo.
  if (user.role === 'asesor') {
    query.andWhere(
      'request.asesor = :currentUser',
      {
        currentUser: user.username,
      },
    );
  } else if (asesor) {
    // Admin y supervisor sí pueden filtrar por asesor.
    query.andWhere(
      'request.asesor = :asesor',
      {
        asesor,
      },
    );
  }

  if (estado) {
    query.andWhere(
      'request.estado = :estado',
      {
        estado,
      },
    );
  }

  if (cliente) {
    query.andWhere(
      'request.cliente ILIKE :cliente',
      {
        cliente: `%${cliente}%`,
      },
    );
  }

  if (desde) {
    query.andWhere(
      'request.creadaEn >= :desde',
      {
        desde: new Date(desde),
      },
    );
  }

  if (hasta) {
    query.andWhere(
      'request.creadaEn <= :hasta',
      {
        hasta: new Date(hasta),
      },
    );
  }

  query
    .orderBy('request.creadaEn', 'DESC')
    .skip((page - 1) * limit)
    .take(limit);

  const [items, total] =
    await query.getManyAndCount();

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
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
  const existingRequest =
    await this.findOne(id, user);

  const currentStatus =
    existingRequest.estado;

  const newStatus =
    updateStatusDto.estado;

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

  return this.dataSource.transaction(
    async (manager) => {
      const requestRepository =
        manager.getRepository(Request);

      const historyRepository =
        manager.getRepository(RequestHistory);

      const request =
        await requestRepository.findOne({
          where: {
            id: existingRequest.id,
          },
        });

      if (!request) {
        throw new NotFoundException(
          'Inquiry not found',
        );
      }

      request.estado = newStatus;

      const savedRequest =
        await requestRepository.save(request);

      const history =
        historyRepository.create({
          solicitudId: request.id,
          tipoEvento:
            HistoryEventType.STATUS,
          valorAnterior:
            currentStatus,
          valorNuevo:
            newStatus,
          usuarioActor:
            user.username,
        });

      await historyRepository.save(history);

      return savedRequest;
    },
  );
}
async assign(
  id: number,
  assignRequestDto: AssignRequestDto,
  user: SystemUser,
) {
  const assignedUser = USERS.find(
    (systemUser) =>
      systemUser.username ===
        assignRequestDto.asesorId &&
      systemUser.role === 'asesor',
  );

  if (!assignedUser) {
    throw new BadRequestException(
      'The assigned user must exist and have asesor role',
    );
  }

  return this.dataSource.transaction(
    async (manager) => {
      const requestRepository =
        manager.getRepository(Request);

      const historyRepository =
        manager.getRepository(RequestHistory);

      const request =
        await requestRepository.findOne({
          where: { id },
        });

      if (!request) {
        throw new NotFoundException(
          'Inquiry not found',
        );
      }

      if (
        request.estado === RequestStatus.RESOLVED
      ) {
        throw new ConflictException(
          'A resolved inquiry cannot be reassigned',
        );
      }

      const previousAsesor = request.asesor;

      request.asesor = assignedUser.username;

      const savedRequest =
        await requestRepository.save(request);

      const history =
        historyRepository.create({
          solicitudId: request.id,
          tipoEvento:
            HistoryEventType.ASSIGNMENT,
          valorAnterior: previousAsesor,
          valorNuevo: assignedUser.username,
          usuarioActor: user.username,
        });

      await historyRepository.save(history);

      return savedRequest;
    },
  );
}
async findHistory(
  id: number,
  user: SystemUser,
) {
  const request = await this.findOne(id, user);

  return this.dataSource
    .getRepository(RequestHistory)
    .find({
      where: {
        solicitudId: request.id,
      },
      order: {
        fechaEvento: 'ASC',
      },
    });
}
}