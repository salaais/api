//src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { UserInfoByToken } from './entity/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.usuario.findUnique({
      where: { email: email },
    });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.senha); //nao criptografado, criptogfrafado

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      access_token: this.jwtService.sign({ user_id: user.id }),
    };
  }

  async userInfoByToken(access_token: string): Promise<UserInfoByToken> {
    // Decodifica o token JWT
    const decodedToken = this.jwtService.decode(access_token) as any;

    if (!decodedToken) {
      throw new UnauthorizedException('Invalid token');
    }
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        id: decodedToken.user_id, // Supondo que o token contenha `userd`
      },
      include: {
        tipo_login: true, // Inclui o relacionamento `tipo_login` se precisar retornar o tipo de login.
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Retorna as informações do usuário junto com `iat` e `exp`
    return {
      user_id: Number(usuario.id),
      iat: decodedToken.iat,
      exp: decodedToken.exp,
      email: usuario.email,
      user_name: usuario.username,
      nome: usuario.nome,
      tipo_login: usuario.tipo_login.key, // Acesso ao tipo de login associado
      data_atualizacao_usuario: usuario.data_atualizacao || null,
      data_criacao_usuario: usuario.data_criacao || null,
    };
  }

  async validateUser(token: string): Promise<any> {
    const decoded = this.jwtService.verify(token);
    const user = await this.prisma.usuario.findUnique({
      where: { id: decoded.userId },
      include: {
        permissaoUsuario: { // Incluindo o relacionamento PermissaoUsuario
          include: {
            permissao: true, // Incluindo a Permissao associada
          },
        },
      },
    });
  
    // Transformando permissões em um array
    const userWithPermissions = {
      ...user,
      permissions: user.permissaoUsuario.map((pu) => pu.permissao.key), // Acessando a chave da permissão
    };
  
    return userWithPermissions; // Agora `permissions` é um array de chaves
  }
  
}
