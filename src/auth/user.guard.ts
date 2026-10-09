import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { USERS } from './user.js';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const username = request.headers['x-user'];

    if (!username || Array.isArray(username)) {
      throw new UnauthorizedException(
        'The x-user header is required',
      );
    }

    const user = USERS.find(
      (user) => user.username === username,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    // ESTA LÍNEA ES FUNDAMENTAL
    request.user = user;

    return true;
  }
}