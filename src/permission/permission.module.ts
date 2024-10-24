import { Global, Module, forwardRef } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

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
