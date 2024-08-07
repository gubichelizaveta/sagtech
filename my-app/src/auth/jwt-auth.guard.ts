import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (canActivate) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const userId = request.params.id;

      console.log(`из токена: ${user.id}`);
      console.log(`из urL: ${userId}`);
      if (user.role === 'ADMIN') {
        return true;
      }
      if (userId && parseInt(user.id,10) === parseInt(userId, 10)) {
        return true;
      }
      throw new ForbiddenException('доступ запрещен');
    }
    return false;
  }
}
