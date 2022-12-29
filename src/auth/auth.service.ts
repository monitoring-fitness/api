import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ResponseError } from 'src/common/dto/response.dto';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { User } from './schema/user.schema';
import { UserSigninDto } from './dto/user-signin.dto';
import { UserSignupDto } from './dto/user-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: UserSignupDto): Promise<void> {
    const salt = await bcrypt.genSalt();
    const saltedPassword = await bcrypt.hash(
      authCredentialsDto.pass_word,
      salt,
    );
    await this.userModel.create({
      _id: uuidv4(),
      ...authCredentialsDto,
      pass_word: saltedPassword,
    });
  }

  // s-todo: token刷新逻辑？
  async signIn(loginDto: UserSigninDto) {
    const user = await this.userModel.findOne({
      name: loginDto.name,
    });

    if (!user || !(await bcrypt.compare(loginDto.pass_word, user.pass_word))) {
      return new ResponseError('用户名或密码错误');
    }

    const payload: IJwtPayload = { name: loginDto.name };
    // 注意这里签名用的payload，解析出来的也是payload
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
