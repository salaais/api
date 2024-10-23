import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PermissaoDto,
  RegraDto,
  VincularPermissaoUsuarioDto,
  VincularRegraPermissaoDto,
} from './dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPermissions() {
    const permissoes = await this.prisma.permissao.findMany({
      include: {
        RegraPermissao: {
          include: {
            regra: {
              select: {
                key: true, // Selecionar apenas o campo `key` da regra
              },
            },
          },
        },
      },
    });

    // Mapear para ajustar o formato do retorno conforme o desejado
    return permissoes.map((permissao) => ({
      ...permissao,
      RegraPermissao: permissao.RegraPermissao.map((regraPermissao) => ({
        id: regraPermissao.id,
        id_regra: regraPermissao.id_regra,
        contagem_uso: regraPermissao.contagem_uso,
        data_resetar_contagem_uso: regraPermissao.data_resetar_contagem_uso,
        limite_contagem_uso: regraPermissao.limite_contagem_uso,
        key: regraPermissao.regra.key, // Mover `key` da regra diretamente para `RegraPermissao`
      })),
    }));
  }

  async vincularRegraPermissao(
    vincularRegraPermissaoDto: VincularRegraPermissaoDto,
  ) {
    const {
      key_regra,
      key_permissao,
      data_resetar_contagem_uso,
      limite_contagem_uso,
      contagem_uso,
    } = vincularRegraPermissaoDto;

    // Buscar o ID da regra a partir da key
    const regra = await this.prisma.regra.findUnique({
      where: { key: key_regra },
    });

    if (!regra) {
      throw new NotFoundException(
        `Regra com key '${key_regra}' não encontrada`,
      );
    }

    // Buscar o ID da permissão a partir da key
    const permissao = await this.prisma.permissao.findUnique({
      where: { key: key_permissao },
    });

    if (!permissao) {
      throw new NotFoundException(
        `Permissão com key '${key_permissao}' não encontrada`,
      );
    }

    // Verificar se já existe uma relação entre a regra e a permissão
    const regraPermissaoExistente = await this.prisma.regraPermissao.findUnique(
      {
        where: {
          id_regra_id_permissao: {
            id_regra: regra.id,
            id_permissao: permissao.id,
          },
        },
      },
    );

    if (regraPermissaoExistente) {
      throw new ConflictException(
        'A relação entre esta regra e permissão já existe.',
      );
    }

    // Criar a relação na tabela RegraPermissao
    return this.prisma.regraPermissao.create({
      data: {
        id_regra: regra.id,
        id_permissao: permissao.id,
        data_resetar_contagem_uso,
        limite_contagem_uso,
        contagem_uso,
      },
    });
  }

  async desvincularRegraPermissao(
    vincularRegraPermissaoDto: VincularRegraPermissaoDto,
  ) {
    const { key_regra, key_permissao } = vincularRegraPermissaoDto;

    // Buscar o ID da regra a partir da key
    const regra = await this.prisma.regra.findUnique({
      where: { key: key_regra },
    });

    if (!regra) {
      throw new NotFoundException(
        `Regra com key '${key_regra}' não encontrada`,
      );
    }

    // Buscar o ID da permissão a partir da key
    const permissao = await this.prisma.permissao.findUnique({
      where: { key: key_permissao },
    });

    if (!permissao) {
      throw new NotFoundException(
        `Permissão com key '${key_permissao}' não encontrada`,
      );
    }

    // Verificar se a relação entre a regra e a permissão existe
    const regraPermissaoExistente = await this.prisma.regraPermissao.findUnique(
      {
        where: {
          id_regra_id_permissao: {
            id_regra: regra.id,
            id_permissao: permissao.id,
          },
        },
      },
    );

    if (!regraPermissaoExistente) {
      throw new NotFoundException(
        'A relação entre esta regra e permissão não existe.',
      );
    }

    // Remover a relação na tabela RegraPermissao
    return this.prisma.regraPermissao.delete({
      where: {
        id_regra_id_permissao: {
          id_regra: regra.id,
          id_permissao: permissao.id,
        },
      },
    });
  }

  async vincularPermissaoUsuario(
    vincularPermissaoUsuarioDto: VincularPermissaoUsuarioDto,
  ) {
    const { id_usuario, username, email, key_permissao, data_expiracao } =
      vincularPermissaoUsuarioDto;

    // Verificar se pelo menos um dos campos (id, username, email) foi fornecido
    if (!id_usuario && !username && !email) {
      throw new BadRequestException(
        'Pelo menos um dos campos "id_usuario", "username" ou "email" deve ser fornecido.',
      );
    }

    // Buscar o usuário por ID, username ou email
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          id_usuario ? { id: id_usuario } : undefined, // Busca pelo ID se fornecido
          username ? { username } : undefined, // Busca pelo username se fornecido
          email ? { email } : undefined, // Busca pelo email se fornecido
        ].filter(Boolean), // Remove valores undefined
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        `Usuário com identificador fornecido não encontrado.`,
      );
    }

    // Buscar o ID da permissão a partir da key
    const permissao = await this.prisma.permissao.findUnique({
      where: { key: key_permissao },
    });

    if (!permissao) {
      throw new NotFoundException(
        `Permissão com key '${key_permissao}' não encontrada`,
      );
    }

    // Verificar se já existe uma relação entre o usuário e a permissão
    const permissaoUsuarioExistente =
      await this.prisma.permissaoUsuario.findUnique({
        where: {
          id_usuario_id_permissao: {
            id_usuario: usuario.id, // Aqui você pode usar usuario.id
            id_permissao: permissao.id,
          },
        },
      });

    if (permissaoUsuarioExistente) {
      throw new ConflictException(
        'A permissão já está vinculada a este usuário.',
      );
    }

    // Criar a relação na tabela PermissaoUsuario
    return this.prisma.permissaoUsuario.create({
      data: {
        id_usuario: usuario.id, // Aqui você também pode usar usuario.id
        id_permissao: permissao.id,
        data_expiracao: data_expiracao ?? null, // Usar a data atual ou a fornecida
      },
    });
  }

  async desvincularPermissaoUsuario(
    vincularPermissaoUsuarioDto: VincularPermissaoUsuarioDto,
  ) {
    const { id_usuario, username, email, key_permissao } =
      vincularPermissaoUsuarioDto;

    // Verificar se pelo menos um dos campos (id, username, email) foi fornecido
    if (!id_usuario && !username && !email) {
      throw new BadRequestException(
        'Pelo menos um dos campos "id_usuario", "username" ou "email" deve ser fornecido.',
      );
    }

    // Buscar o usuário por ID, username ou email
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          id_usuario ? { id: id_usuario } : undefined,
          username ? { username } : undefined,
          email ? { email } : undefined,
        ].filter(Boolean),
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        `Usuário com identificador fornecido não encontrado.`,
      );
    }

    // Buscar o ID da permissão a partir da key
    const permissao = await this.prisma.permissao.findUnique({
      where: { key: key_permissao },
    });

    if (!permissao) {
      throw new NotFoundException(
        `Permissão com key '${key_permissao}' não encontrada`,
      );
    }

    // Verificar se a permissão está vinculada ao usuário
    const permissaoUsuarioExistente =
      await this.prisma.permissaoUsuario.findUnique({
        where: {
          id_usuario_id_permissao: {
            id_usuario: usuario.id,
            id_permissao: permissao.id,
          },
        },
      });

    if (!permissaoUsuarioExistente) {
      throw new NotFoundException(
        'A permissão não está vinculada a este usuário.',
      );
    }

    // Remover a relação da tabela PermissaoUsuario
    return this.prisma.permissaoUsuario.delete({
      where: {
        id_usuario_id_permissao: {
          id_usuario: usuario.id,
          id_permissao: permissao.id,
        },
      },
    });
  }

  async findAllRules() {
    return await this.prisma.regra.findMany({
      include: {
        RegraPermissao: true, // Inclui as permissões relacionadas
      },
    });
  }

  async editarPermissao(key: string, editarPermissaoDto: PermissaoDto) {
    return this.prisma.permissao.update({
      where: { key },
      data: {
        key: editarPermissaoDto.key ?? key,
        descricao: editarPermissaoDto.descricao,
      },
    });
  }

  async criarRegra(criarRegraDto: RegraDto) {
    const existingRegra = await this.prisma.regra.findUnique({
      where: { key: criarRegraDto.key },
    });

    if (existingRegra) {
      throw new HttpException('Regra já existe', HttpStatus.CONFLICT);
    }

    return await this.prisma.regra.create({
      data: criarRegraDto,
    });
  }

  async criarPermissao(criarPermissaoDto: PermissaoDto) {
    const existingPermissao = await this.prisma.permissao.findUnique({
      where: { key: criarPermissaoDto.key },
    });

    if (existingPermissao) {
      throw new HttpException('Permissão já existe', HttpStatus.CONFLICT);
    }

    return await this.prisma.permissao.create({
      data: criarPermissaoDto,
    });
  }

  async editarRegra(key: string, editarRegraDto: RegraDto) {
    return this.prisma.regra.update({
      where: { key },
      data: {
        key: editarRegraDto.key ?? key,
        descricao: editarRegraDto.descricao,
      },
    });
  }

  async deletarPermissao(key: string) {
    return this.prisma.permissao.delete({
      where: { key },
    });
  }

  async deletarRegra(key: string) {
    return this.prisma.regra.delete({
      where: { key },
    });
  }
}
