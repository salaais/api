import { Injectable } from '@nestjs/common';
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

  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    const { password, ...rest } = createUserDto;

    const data = {
      ...rest,
      senha: hashedPassword, // Mapeando para o campo correto na tabela do Prisma
    };

    return this.prisma.usuario.create({
      data,
    });
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

    const { ...rest } = updateUserDto;

    const data = {
      ...rest,
    };

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
