import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsService } from './requests.service.js';
import { RequestsController } from './requests.controller.js';
import { Request } from './entities/request.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}


