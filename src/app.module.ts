import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { QuestionModule } from './question/question.module';
import { PermissionModule } from './permission/permission.module';
import { HelloController } from './hello/hello.controller';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'node_modules', 'swagger-ui-dist'),
      serveRoot: '/swagger',
    }),
    QuestionModule,
    PermissionModule,
  ],
  controllers: [AppController, HelloController],
  providers: [AppService],
})
export class AppModule {}
