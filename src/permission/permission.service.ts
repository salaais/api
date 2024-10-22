import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PermissaoDto, RegraDto, VincularRegraPermissaoDto } from './dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPermissions() {
    return await this.prisma.permissao.findMany({
      include: {
        RegraPermissao: true, // Inclui as regras relacionadas
      },
    });
  }

  async vincularRegraPermissao(vincularRegraPermissaoDto: VincularRegraPermissaoDto) {
    const { key_regra, key_permissao, data_resetar_contagem_uso, limite_contagem_uso, contagem_uso } = vincularRegraPermissaoDto;

    // Buscar o ID da regra a partir da key
    const regra = await this.prisma.regra.findUnique({
      where: { key: key_regra },
    });

    if (!regra) {
      throw new NotFoundException(`Regra com key "${key_regra}" não encontrada`);
    }

    // Buscar o ID da permissão a partir da key
    const permissao = await this.prisma.permissao.findUnique({
      where: { key: key_permissao },
    });

    if (!permissao) {
      throw new NotFoundException(`Permissão com key "${key_permissao}" não encontrada`);
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
