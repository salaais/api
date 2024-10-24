import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  ParseIntPipe,
  Req,
  Headers,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiBody,
} from '@nestjs/swagger';
import { Permissions as PermissionsDecorator } from '../permission/permissions.decorator';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RemoveUserDto } from './dto/remove-user.dto';
import { UserPermissions } from '../utils/permission.enum';
import { PermissionsGuard } from '../permission/permissions.guard';
import { JwtService } from '@nestjs/jwt';
import { StatusDeletadoDto, StatusDesativadoDto } from './dto/status-user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthPermissionsGuard } from '../auth/auth.decorator';

@ApiTags('Usuario')
@Controller('usuario')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('dados-publicos')
  @AuthPermissionsGuard(UserPermissions.LISTAR_DADOS_PUBLICOS_USUARIOS)
  async findAllSimple() {
    return this.usersService.findAllSimple();
  }

  @Get('dados-confidenciais')
  @AuthPermissionsGuard(UserPermissions.LISTAR_DADOS_CONFIENCIAIS_USUARIOS)
  @ApiResponse({ status: 200, description: 'Successful response' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Post('criar')
  @ApiOperation({ summary: 'Cadastrar usuário' })
  @ApiResponse({ status: 201, description: 'User Created' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @AuthPermissionsGuard(UserPermissions.LISTAR_USUARIO_POR_ID)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  findOneByToken(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @AuthPermissionsGuard(UserPermissions.DELETAR_USUARIO)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return {};
  }

  @Post('alterar-status-meu-usuario-deletado')
  @AuthPermissionsGuard(UserPermissions.ALTERAR_STATUS_MEU_USUARIO)
  async alterarStatusDeletado(
    @Req() req,
    @Body() body: StatusDeletadoDto,
  ): Promise<any> {
    // Extrair o token de autorização
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpException(
        'Authorization header não encontrado',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const access_token = authorizationHeader.split(' ')[1];
    const decodedToken = await this.authService.userInfoByToken(access_token);
    return this.usersService.alterarStatusDeletado(
      decodedToken.id_usuario,
      body.deletado,
    );
  }

  @Post('alterar-status-meu-usuario-desativado')
  @AuthPermissionsGuard(UserPermissions.ALTERAR_STATUS_MEU_USUARIO)
  async alterarStatusDesativado(
    @Req() req,
    @Body() body: StatusDesativadoDto,
  ): Promise<any> {
    // Extrair o token de autorização
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpException(
        'Authorization header não encontrado',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const access_token = authorizationHeader.split(' ')[1];
    const decodedToken = await this.authService.userInfoByToken(access_token);
    return this.usersService.alterarStatusDesativado(
      decodedToken.id_usuario,
      body.desativado,
    );
  }

  @Post('teste')
  @ApiOperation({ summary: 'Cadastrar usuário [COMUM]' })
  @ApiResponse({ status: 201, description: 'User Created' })
  async test() {
    return 'teste';
  }
}
