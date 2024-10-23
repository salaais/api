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
    const userId = decodedToken.id_usuario;
  
    if (!userId) {
      throw new ForbiddenException('Usuário não autenticado.');
    }
  
    // Obtém permissões diretas válidas do usuário (não expiradas)
    const validPermissions = await this.usersService.getUserPermissons(userId);
  
    if (!validPermissions.length) {
      throw new ForbiddenException('Usuário não possui permissões válidas.');
    }
  
    const userPermissions = validPermissions.map((perm) => perm.key);
    console.log('Permissões válidas do usuário:', userPermissions);
  
    // Busca regras associadas às permissões do usuário
    const regras = await this.usersService.getRegrasByUserId(userId);
    const regraKeys = regras.map((regra) => regra.key);
    console.log('Regras do usuário:', regraKeys);
  
    const allPermissions = [...userPermissions, ...regraKeys];
    console.log('Permissões requeridas:', requiredPermissions);
  
    const hasPermission = requiredPermissions.some((permission) =>
      allPermissions.includes(permission),
    );
  
    if (!hasPermission) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este recurso.',
      );
    }
  
    console.log('Permissão concedida.');
    return true;
  }  
}