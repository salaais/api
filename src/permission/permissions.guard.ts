import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

    const userId = decodedToken.user_id;

    if (!userId) {
      throw new ForbiddenException('Usuário não autenticado.');
    }

    // Obtém permissões diretas do usuário
    const user = await this.usersService.getUserPermissons(userId);

    if (!user) {
      throw new ForbiddenException('Usuário não encontrado.');
    }

    // Mapeia permissões diretas
    const userPermissions = user.permissaoUsuario.map(
      (perm) => perm.permissao.key,
    );

    console.log('Permissões do usuário:', userPermissions);

    // Busca regras associadas às permissões do usuário
    const regras = await this.usersService.getRegrasByUserId(userId);
    const regraKeys = regras.map((regra) => regra.key); // Mapeia as chaves das regras

    console.log('Regras do usuário:', regraKeys);

    // Combina permissões diretas com as permissões associadas às regras
    const allPermissions = [...userPermissions, ...regraKeys];
    console.log('Permissões requeridas:', requiredPermissions);

    // Verifica se o usuário possui alguma das permissões necessárias
    const hasPermission = requiredPermissions.some((permission) =>
      allPermissions.includes(permission),
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