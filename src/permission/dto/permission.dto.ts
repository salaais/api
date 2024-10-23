import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';
import { Permissions } from '../enum/permission.enum';

export class PermissaoDto {
  @ApiProperty({
    example: `${Permissions.COMUM}`,
  })
  readonly key: string;

  @ApiProperty({
    example: '',
  })
  readonly descricao: string;
}

export class RegraDto {
  @ApiProperty({
    example: 'deletar_meu_usuario',
  })
  readonly key: string;

  @ApiProperty({
    example: '',
  })
  readonly descricao: string;
}

export class VincularRegraPermissaoDto {
  @ApiProperty({
    description: 'Chave da permissão a ser vinculada',
    example: `${Permissions.COMUM}`,
  })
  readonly key_permissao: string; // id da permissão será obtido a partir do key

  @ApiProperty({
    description: 'Chave da regra a ser vinculada',
    example: 'pegar_usuario_por_id',
  })
  readonly key_regra: string; // id da regra será obtido a partir do key

  @ApiProperty({
    description: 'Data para resetar a contagem de uso',
    example: '2024-12-31T00:00:00.000Z',
  })
  readonly data_resetar_contagem_uso: Date;

  @ApiProperty({
    description: 'Limite máximo de contagem de uso',
    example: 10,
  })
  readonly limite_contagem_uso: number;

  @ApiProperty({
    description: 'Contagem atual de uso',
    example: 5,
  })
  readonly contagem_uso: number;
}

export class VincularPermissaoUsuarioDto {
  @ApiProperty({ example: 4 })
  id_usuario?: number;

  // @ApiProperty({ example: 'filipe' })
  username?: string;

  // @ApiProperty({ example: 'filipe@example.com' })
  email?: string;

  @ApiProperty({ example: `${Permissions.COMUM}` })
  key_permissao: string;

  @ApiProperty({ example: `${new Date().toISOString()}` })
  data_expiracao?: Date;
}

export class DesvincularPermissaoUsuarioDto {
  @ApiProperty({ example: 4 })
  id_usuario?: number;

  // @ApiProperty({ example: 'filipe' })
  username?: string;

  // @ApiProperty({ example: 'filipe@example.com' })
  email?: string;

  @ApiProperty({ example: `${Permissions.COMUM}` })
  key_permissao: string;
}