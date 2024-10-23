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
import { UserPermissions } from '../permission/enum/permission.enum';
import { PermissionsGuard } from '../permission/permissions.guard';
import { JwtService } from '@nestjs/jwt';
import { StatusDeletadoDto, StatusDesativadoDto } from './dto/status-user.dto';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('Usuario')
@Controller('usuario')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Get('dados-publicos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @PermissionsDecorator(UserPermissions.LISTAR_DADOS_PUBLICOS_USUARIOS)
  @ApiOperation({
    summary: `[COMUM] - ${UserPermissions.LISTAR_DADOS_PUBLICOS_USUARIOS}`,
  })
  @ApiResponse({ status: 200, description: 'Successful response' })
  async findAllSimple() {
    return this.usersService.findAllSimple();
  }

  @Get('dados-confidenciais')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @PermissionsDecorator(UserPermissions.LISTAR_DADOS_CONFIENCIAIS_USUARIOS)
  @ApiOperation({
    summary: `[ADMIN] - ${UserPermissions.LISTAR_DADOS_CONFIENCIAIS_USUARIOS}`,
  })
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @PermissionsDecorator(UserPermissions.PEGAR_USUARIO_POR_ID)
  @ApiOperation({
    summary: `[ADMIN] - ${UserPermissions.PEGAR_USUARIO_POR_ID}`,
  })
  findOneByToken(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @PermissionsDecorator(UserPermissions.DELETAR_USUARIO)
  @ApiOperation({ summary: `[ADMIN] - ${UserPermissions.DELETAR_USUARIO}` })
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return {};
  }

  @Post('alterar-status-meu-usuario-deletado')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @PermissionsDecorator(UserPermissions.ALTERAR_STATUS_MEU_USUARIO)
  @ApiOperation({
    summary: `[COMUM] - ${UserPermissions.ALTERAR_STATUS_MEU_USUARIO}`,
  })
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
      decodedToken.user_id,
      body.deletado,
    );
  }

  @Post('alterar-status-meu-usuario-desativado')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @PermissionsDecorator(UserPermissions.ALTERAR_STATUS_MEU_USUARIO)
  @ApiOperation({
    summary: `[COMUM] - ${UserPermissions.ALTERAR_STATUS_MEU_USUARIO}`,
  })
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
      decodedToken.user_id,
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
