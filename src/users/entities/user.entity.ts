import { ApiProperty } from '@nestjs/swagger';
import { Usuario as PrismaUser } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsInt } from 'class-validator';

export class UserEntity implements PrismaUser {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  data_criacao: Date;

  @ApiProperty()
  data_atualizacao: Date;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string; // Adicionado

  @ApiProperty()
  id_tipo_login: number; // Adicionado

  @Exclude()
  senha: string;

  @ApiProperty()
  bio: string;
}
