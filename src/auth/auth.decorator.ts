import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PermissionsGuard } from '../permission/permissions.guard';
import { Permissions } from '../permission/permissions.decorator';

export function AuthPermissionsGuard(permission?: string[] | string) {
  // Inicializa o array de decoradores
  const decorators = [
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    ApiOperation({
      summary: `Permissão: ${
        !permission || (Array.isArray(permission) && permission.length === 0)
          ? 'Nenhuma'
          : Array.isArray(permission)
            ? permission.join(', ')
            : permission
      }`,
    }),
    ApiResponse({
      status: 200,
      description: 'Operação realizada com sucesso.',
    }),
    ApiUnauthorizedResponse({
      description: 'Token inválido ou não fornecido.',
    }),
    ApiForbiddenResponse({ description: 'Permissão negada.' }),
  ];

  // Adiciona o guard de permissões se a permissão for fornecida
  if (permission) {
    decorators.push(UseGuards(PermissionsGuard));

    // Verifica se é um array ou uma string e espalha o array, se necessário
    if (Array.isArray(permission)) {
      decorators.push(Permissions(...permission)); // Espalha as permissões se for um array
    } else {
      decorators.push(Permissions(permission)); // Passa a string diretamente
    }
  }

  return applyDecorators(...decorators);
}
