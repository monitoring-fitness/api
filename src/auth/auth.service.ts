import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/core/interface';
import { UserSignupDto } from 'src/core/dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserSigninDto } from './dto/user-signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: UserSignupDto): Promise<void> {
    const user = new User();
    user._id = uuidv4();
    user.name = authCredentialsDto.name;
    user.email = authCredentialsDto.email;
    user.avatar_url = authCredentialsDto.avatar_url;
    user.salt = await bcrypt.genSalt();
    user.pass_word = await bcrypt.hash(authCredentialsDto.pass_word, user.salt);

    await this.userModel.create(user);
  }

  async signIn(loginDto: UserSigninDto): Promise<{ accessToken: string }> {
    // s-todo: 没做密码校验！
    const isExist = await this.userModel.exists({
      name: loginDto.name,
    });

    if (!isExist) {
      throw new Error('Invalid credentials');
    }

    const payload: IJwtPayload = { username: loginDto.name };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
