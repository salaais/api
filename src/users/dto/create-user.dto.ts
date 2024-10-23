import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'filipe123',
    description: 'O nome de usuário do sistema',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'Filipe Souza',
    description: 'O nome completo do usuário',
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    example: 'filipe.souza@example.com',
    description: 'O endereço de email do usuário',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'A senha do usuário (mínimo de 8 caracteres)',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'Olá, estou usando SalaAis!',
  })
  @IsString()
  bio: string;

  @ApiProperty({
    example: 'sala_ais',
    description: 'O ID do tipo de login do usuário',
  })
  @IsNotEmpty()
  @IsString()
  tipo_login: string;
}
