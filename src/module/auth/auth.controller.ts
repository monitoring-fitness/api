import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthCredentialDto, AuthLoginDto } from 'src/core/dto';
import { AuthService } from './auth.service';
import { HTTPResponse } from '../../util/HTTPResponse';
import { UserAuthCode, UserAuthCode2Message } from '../../domain/business-code';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialDto) {
    await this.authService.signUp(authCredentialsDto);

    return new HTTPResponse(
      UserAuthCode.successCreated,
      UserAuthCode2Message[UserAuthCode.successCreated],
      null,
    );
  }

  @Post('signin')
  signIn(@Body() loginDto: AuthLoginDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(loginDto);
  }

  @Get('test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    return { msg: 'success' };
  }
}
