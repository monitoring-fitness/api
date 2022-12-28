import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorator/user.decorator';
import { AuthService } from './auth.service';
import { UserSignupDto } from './dto/user-signup.dto';
import { Iuser } from './interface/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() userSignupDto: UserSignupDto) {
    await this.authService.signUp(userSignupDto);
  }

  @Post('signin')
  async signIn(@Body() loginDto) {
    return await this.authService.signIn(loginDto);
  }

  @Get('test_auth')
  @UseGuards(AuthGuard())
  test(@User() user: Iuser) {
    return { success: 'success' };
  }
}
