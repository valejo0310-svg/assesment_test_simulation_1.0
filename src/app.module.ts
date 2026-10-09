import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RequestsModule } from './requests/requests.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [RequestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
