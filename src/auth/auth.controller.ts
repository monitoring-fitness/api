import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserSignupDto } from 'src/core/dto';
import { AuthService } from './auth.service';
import { HTTPResponse } from '../util/HTTPResponse';
import { UserAuthCode, UserAuthCode2Message } from '../domain/business-code';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() userSignupDto: UserSignupDto) {
    await this.authService.signUp(userSignupDto);

    return new HTTPResponse(
      UserAuthCode.successCreated,
      UserAuthCode2Message[UserAuthCode.successCreated],
      null,
    );
  }

  @Post('signin')
  signIn(@Body() loginDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(loginDto);
  }

  @Get('test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    return { msg: 'success' };
  }
}
