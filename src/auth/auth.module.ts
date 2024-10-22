import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module'; // Importa o UsersModule
import { JwtStrategy } from './jwt.strategy';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    PermissionModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRATION },
    }),
    forwardRef(() => UsersModule), // Adicione forwardRef aqui
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
