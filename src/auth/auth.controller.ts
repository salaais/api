import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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

  @Get('token')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  // @ApiOkResponse({ type: AuthEntity })
  userInfoByToken2(@Req() req) {
    const access_token = req.headers.authorization.split(' ')[1];
    return this.authService.userInfoByToken(access_token);
  }
}
