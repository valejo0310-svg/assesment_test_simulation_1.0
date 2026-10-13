import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AssignRequestDto {
  @ApiProperty({
    example: 'asesor2',
  })
  @IsString()
  @IsNotEmpty()
  asesorId: string;
}