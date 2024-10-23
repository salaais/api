import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import {
  DesvincularPermissaoUsuarioDto,
  PermissaoDto,
  RegraDto,
  VincularPermissaoUsuarioDto,
  VincularRegraPermissaoDto,
} from './dto/permission.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permissao')
@Controller('permissao')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('permissao')
  async findAll() {
    return this.permissionService.findAllPermissions();
  }

  @Post('permissao')
  async criarPermissao(@Body() criarPermissaoDto: PermissaoDto) {
    return this.permissionService.criarPermissao(criarPermissaoDto);
  }

  @Post('permissao/vincular-regra-permissao')
  async vincularRegraPermissao(
    @Body() vincularRegraPermissaoDto: VincularRegraPermissaoDto,
  ) {
    return this.permissionService.vincularRegraPermissao(
      vincularRegraPermissaoDto,
    );
  }

  @Post('permissao/desvincular-regra-permissao')
  async desvincularRegraPermissao(
    @Body() vincularRegraPermissaoDto: VincularRegraPermissaoDto,
  ) {
    return this.permissionService.desvincularRegraPermissao(
      vincularRegraPermissaoDto,
    );
  }

  @Post('permissao/vincular-permissao-usuario')
  async vincularPermissaoUsuario(
    @Body() vincularPermissaoUsuario: VincularPermissaoUsuarioDto,
  ) {
    return this.permissionService.vincularPermissaoUsuario(
      vincularPermissaoUsuario,
    );
  }

  @Post('permissao/desvincular-permissao-usuario')
  async desvincularPermissaoUsuario(
    @Body() desvincularPermissaoUsuario: DesvincularPermissaoUsuarioDto,
  ) {
    return this.permissionService.desvincularPermissaoUsuario(
      desvincularPermissaoUsuario,
    );
  }

  @Get('regra')
  async findAllRules() {
    return this.permissionService.findAllRules();
  }

  @Post('regra')
  async criarRegra(@Body() criarRegraDto: RegraDto) {
    return this.permissionService.criarRegra(criarRegraDto);
  }

  @Delete('permissao/:key')
  async deletePermissao(@Param('key') key: string) {
    return this.permissionService.deletarPermissao(key);
  }

  @Delete('regra/:key')
  async deleteRegra(@Param('key') key: string) {
    return this.permissionService.deletarRegra(key);
  }

  @Put('permissao/:key')
  async editaPermissao(
    @Param('key') key: string,
    @Body() editarPermissaoDto: PermissaoDto,
  ) {
    return this.permissionService.editarPermissao(key, editarPermissaoDto);
  }

  @Put('regra/:key')
  async editaRegra(
    @Param('key') key: string,
    @Body() editarRegraDto: RegraDto,
  ) {
    return this.permissionService.editarRegra(key, editarRegraDto);
  }
}
