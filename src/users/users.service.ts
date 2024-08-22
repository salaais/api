import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Usuario } from '@prisma/client';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    // Verificar se o email já existe
    const existingUserByEmail = await this.prisma.usuario.findUnique({
      where: { email: createUserDto.email },
    });
  
    if (existingUserByEmail) {
      throw new HttpException('Email already exists', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  
    // Verificar se o username já existe
    const existingUserByUsername = await this.prisma.usuario.findUnique({
      where: { username: createUserDto.username },
    });
  
    if (existingUserByUsername) {
      throw new HttpException('Username already exists', HttpStatus.UNPROCESSABLE_ENTITY);
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
      throw new HttpException('Tipo de login não encontrado', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  
    const data = {
      ...rest,
      senha: hashedPassword,
      id_tipo_login: tipoLogin.id, // Salvar a referência do id do tipo de login
    };
  
    const createdUser = await this.prisma.usuario.create({
      data,
    });
  
    // Criar uma cópia do objeto excluindo o campo senha
    const { senha, ...userWithoutPassword } = createdUser;
  
    return userWithoutPassword;
  }

  async findAll() {
    return this.prisma.usuario.findMany();
  }

  async findOne(id: number): Promise<Usuario> {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.usuario.delete({ where: { id } });
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
}
