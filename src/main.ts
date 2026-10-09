import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptors.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);

  const config = new DocumentBuilder()
    .setTitle('Business')
    .setDescription('API to manage business inquieres')
    .setVersion('1.0')
    .addTag('Inquiries')
    .addApiKey(
    {
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
    },
    'x-api-key',
  )

    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);
  const port = process.env.PORT ?? 3002

  app.useGlobalInterceptors(
  new ResponseInterceptor(),
);
app.useGlobalFilters(
  new HttpExceptionFilter(),
);

  await app.listen(port);
  console.log(`API is running in http://localhost:${port}`);
  console.log(`Swagger is running in http://localhost:${port}/api/docs`);
}
await bootstrap();
