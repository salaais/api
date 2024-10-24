import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService],
  imports: [PrismaModule, PermissionModule],
  exports: [QuestionService],
})
export class QuestionModule {}
