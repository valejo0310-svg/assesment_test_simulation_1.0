import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { RequestStatus } from '../entities/request.entity.js';

export class UpdateStatusDto {
  @ApiProperty({
    enum: RequestStatus,
    example: RequestStatus.IN_PROGRESS,
  })
  @IsEnum(RequestStatus)
  estado: RequestStatus;
}