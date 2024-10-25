import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Usuario } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PermissionService } from '../permission/permission.service';
import { Permissions } from '../permission/enum/permission.enum';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private PermissionService: PermissionService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    // Verificar se o email já existe
    const existingUserByEmail = await this.prisma.usuario.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUserByEmail) {
      throw new HttpException(
        'Email already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Verificar se o username já existe
    const existingUserByUsername = await this.prisma.usuario.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUserByUsername) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    const { password, tipo_login, ...rest } = createUserDto;

    // Buscar o id do TipoLogin com base no nome
    const tipoLogin = await this.prisma.tipoLogin.findUnique({
      where: { key: tipo_login },
    });

    if (!tipoLogin) {
      throw new HttpException(
        'Tipo de login não encontrado',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const data = {
      ...rest,
      senha: hashedPassword,
      id_tipo_login: tipoLogin.id,
      bio: createUserDto.bio || 'Olá, estou usando SalaAis!',
      data_atualizacao: null,
    };

    const createdUser = await this.prisma.usuario.create({
      data,
    });

    // Criar uma cópia do objeto excluindo o campo senha
    const { senha, ...userWithoutPassword } = createdUser;

    await this.PermissionService.vincularPermissaoUsuario({
      id_usuario: createdUser.id,
      key_permissao: Permissions.COMUM,
      data_expiracao: null,
    });

    return userWithoutPassword;
  }

  async findAllSimple() {
    return this.prisma.usuario.findMany({
      select: {
        username: true,
        nome: true,
        data_criacao: true,
        bio: true,
      },
    });
  }

  async findAll() {
    return this.prisma.usuario.findMany();
  }

  async findOne(id: number): Promise<Usuario> {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async getUserPermissons(userId: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        permissaoUsuario: {
          include: {
            permissao: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const currentDate = new Date();

    // Filtra permissões válidas (não expiradas)
    const validPermissions = user.permissaoUsuario.filter(
      (perm) =>
        !perm.data_expiracao || new Date(perm.data_expiracao) > currentDate,
    );

    // Remove permissões expiradas diretamente no banco de dados
    await this.prisma.permissaoUsuario.deleteMany({
      where: {
        id_usuario: userId,
        data_expiracao: { lt: currentDate },
      },
    });

    return validPermissions.map((perm) => perm.permissao);
  }

  // Busca as regras e suas permissões associadas para o usuário
  async getRegrasByUserId(userId: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        permissaoUsuario: {
          include: {
            permissao: {
              include: {
                RegraPermissao: {
                  include: {
                    regra: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const currentDate = new Date();

    // Filtra permissões válidas (não expiradas)
    const validPermissions = user.permissaoUsuario.filter(
      (perm) =>
        !perm.data_expiracao || new Date(perm.data_expiracao) > currentDate,
    );

    // Remove permissões expiradas
    await this.prisma.permissaoUsuario.deleteMany({
      where: {
        id_usuario: userId,
        data_expiracao: { lt: currentDate },
      },
    });

    // Retorna as regras associadas às permissões válidas
    return validPermissions.flatMap((perm) =>
      perm.permissao.RegraPermissao.map((rp) => rp.regra),
    );
  }

  async getPermissoesByRegraId(regraId: number) {
    return this.prisma.regra.findUnique({
      where: { id: regraId },
      include: {
        RegraPermissao: {
          include: {
            permissao: true, // Inclui as permissões associadas
          },
        },
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.usuario.delete({ where: { id } });
  }

  async removeMe(userId: number): Promise<void> {
    console.log('Removing User ID:', userId); // Para verificar o valor recebido

    if (typeof userId !== 'number' || isNaN(userId)) {
      throw new UnauthorizedException(
        'User ID inválido ou não encontrado no token.',
      );
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    await this.prisma.usuario.delete({
      where: { id: userId },
    });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    const { tipo_login, ...rest } = updateUserDto;

    const data: any = {
      ...rest,
    };

    // Verificar se o tipo_login foi fornecido
    if (tipo_login) {
      const tipoLogin = await this.prisma.tipoLogin.findUnique({
        where: { key: tipo_login },
      });

      if (!tipoLogin) {
        throw new Error('Tipo de login não encontrado');
      }

      // Conectar o tipo de login pelo id
      data.tipo_login = {
        connect: { id: tipoLogin.id },
      };
    }

    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async findByLogin(email: string, password: string): Promise<Usuario | null> {
    const user = await this.prisma.usuario.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return null; // User not found
    }
    const isPasswordValid = await bcrypt.compare(password, user.senha);
    if (!isPasswordValid) {
      return null; // Incorrect password
    }
    return user; // Return authenticated user
  }

  async alterarStatusDesativado(
    userId: number,
    desativado: boolean,
  ): Promise<any> {
    // Buscar o usuário no banco de dados
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    // Atualizar o status de 'desativado' do usuário
    const usuarioAtualizado = await this.prisma.usuario.update({
      where: { id: userId },
      data: {
        desativado: desativado, // Definir com base no valor passado no request
        data_atualizacao: new Date(), // Atualiza a data de atualização
      },
    });

    return {
      message: 'Status de desativação alterado com sucesso.',
      desativado: usuarioAtualizado.desativado,
    };
  }

  async alterarStatusDeletado(userId: number, deletado: boolean): Promise<any> {
    // Buscar o usuário no banco de dados
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    // Atualizar o status de 'desativado' do usuário
    const usuarioAtualizado = await this.prisma.usuario.update({
      where: { id: userId },
      data: {
        deletado: deletado, // Definir com base no valor passado no request
        data_atualizacao: new Date(), // Atualiza a data de atualização
      },
    });

    return {
      message: 'Status de deleção alterado com sucesso.',
      deletado: usuarioAtualizado.deletado,
    };
  }
}
