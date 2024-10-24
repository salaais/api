import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  imports: [PrismaModule, PermissionModule],
  exports: [QuestionService],
})
export class QuestionModule {}
