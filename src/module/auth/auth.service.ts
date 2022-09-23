import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../domain/schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/core/interface';
import { AuthCredentialDto, AuthLoginDto } from 'src/core/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
    const user = new User();
    user.name = authCredentialsDto.name;
    user.email = authCredentialsDto.email;
    user.avatar_url = authCredentialsDto.avatar_url;
    user.salt = await bcrypt.genSalt();
    user.pass_word = await bcrypt.hash(authCredentialsDto.pass_word, user.salt);

    try {
      await this.userModel.create(user);
    } catch (e) {
      console.error(e);
    }
  }
  async signIn(
    loginDto: AuthLoginDto,
    // ): Promise<{ accessToken: string }> {
  ): Promise<any> {
    const userInfo = await this.userModel.findOne({
      name: loginDto.name,
    });

    if (!userInfo?.name) {
      return '没账号';
    }

    const payload: IJwtPayload = { username: loginDto.name };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
