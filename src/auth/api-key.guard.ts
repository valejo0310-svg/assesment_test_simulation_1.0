import {CanActivate, ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest();

    const apiKey = request.headers['x-api-key'];

    if (!apiKey || Array.isArray(apiKey)) {
      throw new UnauthorizedException(
        'The x-api-key header is required',
      );
    }

    const configuredKeys =
      this.configService.get<string>('API_KEYS');

    const validKeys = configuredKeys
      ?.split(',')
      .map((key) => key.trim())
      .filter(Boolean);

    if (!validKeys?.includes(apiKey)) {
      throw new UnauthorizedException(
        'Invalid API key',
      );
    }

    return true;
  }
}