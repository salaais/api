import { ApiProperty } from '@nestjs/swagger';

export class PermissaoDto {
  @ApiProperty({
    example: 'COMUM',
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
    description: 'Chave da regra a ser vinculada',
    example: 'pegar_usuario_por_id',
  })
  readonly key_regra: string; // id da regra será obtido a partir do key

  @ApiProperty({
    description: 'Chave da permissão a ser vinculada',
    example: 'COMUM',
  })
  readonly key_permissao: string; // id da permissão será obtido a partir do key

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
