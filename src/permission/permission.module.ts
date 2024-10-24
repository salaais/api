import { Global, Module, forwardRef } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [
    PermissionService,
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
})
export class PermissionModule {}
