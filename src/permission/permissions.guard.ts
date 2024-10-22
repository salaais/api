// src/permissions/permissions.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { UsersService } from '../users/users.service'; // Importe o serviço de usuários
import { JwtService } from '@nestjs/jwt'; // Para decodificar o JWT

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions) {
      console.log('Nenhuma permissão requerida, acesso liberado.');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException('Token não encontrado');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = this.jwtService.decode(token) as any;

    const user = await this.usersService.getUserPermissons(decodedToken.user_id);

    if (!user) {
      throw new ForbiddenException('Usuário não encontrado.');
    }

    const userPermissions = user.permissaoUsuario.map(
      (perm) => perm.permissao.key,
    );

    console.log('User Permissions:', userPermissions);
    console.log('Required Permissions:', requiredPermissions);

    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      console.log('Permissão negada.');
      throw new ForbiddenException(
        'Você não tem permissão para acessar este recurso.',
      );
    }

    console.log('Permissão concedida.');
    return true;
  }
}
