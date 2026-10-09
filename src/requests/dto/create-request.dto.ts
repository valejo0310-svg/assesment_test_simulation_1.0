import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({
    example: 'Riwi Business Inquieries',
    description: 'Inquieries managment API',
  })
  @IsString()
  @IsNotEmpty()
  cliente: string;

  @ApiProperty({
    example: 'Inquiry description',
    description: 'Inquiry motive',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}