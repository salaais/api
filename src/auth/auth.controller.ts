import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { AccessToken } from './dto/token.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Get('dados-usuario-por-token')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  // @ApiOkResponse({ type: AuthEntity })
  userInfoByToken2(@Req() req) {
    const access_token = req.headers.authorization.split(' ')[1];
    return this.authService.userInfoByToken(access_token);
  }

  @Get('gerar-token-pelo-token-google')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  gerarTokenPeloTokenGoogle(@Req() req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException(`Authorization não foi fornecido authHeader: ${authHeader}`);
    }
    const access_token = req.headers.authorization.split(' ')[1];
    return this.authService.gerarTokenPeloTokenGoogle(access_token);
  }

  @Get('cadastrar-usuario-pelo-token')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  // @ApiOkResponse({ type: AuthEntity })
  cadastrarUsuarioPeloToken(@Req() req) {
    const access_token = req.headers.authorization.split(' ')[1];
    return this.authService.userInfoByToken(access_token);
  }
}
