import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({
    example: 'Empresa ABC',
    description: 'Client name',
  })
  @IsString()
  @IsNotEmpty()
  cliente: string;

  @ApiProperty({
    example: 'Commercial follow-up',
    description: 'Inquiry description',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    example: 'asesor1',
    description: 'Assigned adviser',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  asesor?: string;
}