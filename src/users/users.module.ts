import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';
import { APP_FILTER } from '@nestjs/core';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClientExceptionFilter } from '../common/filters/prisma-exception.filter';
import { AuthModule } from '../auth/auth.module'; // Importa o AuthModule

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    forwardRef(() => AuthModule), // Adicione forwardRef aqui
  ],
  exports: [UsersService],
})
export class UsersModule {}



// @Module({
//   imports: [PrismaModule],
//   controllers: [UsersController],
//   providers: [
//     UsersService,
//     PrismaService,
//     {
//       provide: APP_FILTER,
//       useClass: PrismaClientExceptionFilter,
//     },
//   ],
//   exports: [UsersService],
// })
