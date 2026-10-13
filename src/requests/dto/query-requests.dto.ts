import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { RequestStatus } from '../entities/request.entity.js';

export class QueryRequestsDto {
  @ApiPropertyOptional({
    enum: RequestStatus,
  })
  @IsOptional()
  @IsEnum(RequestStatus)
  estado?: RequestStatus;

  @ApiPropertyOptional({
    example: 'asesor1',
  })
  @IsOptional()
  @IsString()
  asesor?: string;

  @ApiPropertyOptional({
    example: 'Cliente',
  })
  @IsOptional()
  @IsString()
  cliente?: string;

  @ApiPropertyOptional({
    example: '2026-10-01T00:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  desde?: string;

  @ApiPropertyOptional({
    example: '2026-10-31T23:59:59Z',
  })
  @IsOptional()
  @IsISO8601()
  hasta?: string;

  @ApiPropertyOptional({
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    default: 10,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}