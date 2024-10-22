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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Permissions as PermissionsDecorator } from '../permission/permissions.decorator';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RemoveUserDto } from './dto/remove-user.dto';
import { Permissions, UserPermissions } from 'src/permission/enum/permission.enum';
import { PermissionsGuard } from 'src/permission/permissions.guard';

@ApiTags('Usuario')
@Controller('usuario')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('dados-publicos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar Usuarios [COMUM]' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  async findAllSimple() {
    return this.usersService.findAllSimple();
  }

  @Get('dados-confidenciais')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar Usuarios [ADMIN]' })
  @ApiResponse({ status: 200, description: 'Successful response' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Post('criar')
  @ApiOperation({ summary: 'Cadastrar usuário [COMUM]' })
  @ApiResponse({ status: 201, description: 'User Created' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: `[ADMIN] - ${UserPermissions.PEGAR_USUARIO_POR_ID}` })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @PermissionsDecorator(UserPermissions.PEGAR_USUARIO_POR_ID)
  findOneByToken(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get('informacoes-por-token')
  @ApiOperation({ summary: 'Listar usuário [COMUM]' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar usuário [ADMIN]' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return {};
  }

  @Post('eu')
  @ApiOperation({ summary: 'Deletar usuário [COMUM]' })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard) // Descomentando isso, ativaria a proteção com o guard JWT
  @ApiOkResponse({ description: 'Usuário deletado com sucesso.' })
  async removeMe() {
      // Para fins de teste, retorna "test"
      return "test";
      // const accessToken = req.headers.authorization; // 'Bearer TOKEN'
      // console.log("Token extraído:", accessToken);
    
      // Chama o serviço passando o token e retornando OK temporariamente
      // await this.usersService.removeMe(accessToken);accessToken
  }

  @Post('teste')
  @ApiOperation({ summary: 'Cadastrar usuário [COMUM]' })
  @ApiResponse({ status: 201, description: 'User Created' })
  async test() {
    return "teste";
  }
}
