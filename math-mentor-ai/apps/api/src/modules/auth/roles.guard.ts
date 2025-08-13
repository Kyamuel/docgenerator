import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly requiredRole: string) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const roles: string[] = (req.user && (req.user['https://mathmentor.ai/roles'] as string[])) || [];
    if (!this.requiredRole) return true;
    return roles.includes(this.requiredRole);
  }
}