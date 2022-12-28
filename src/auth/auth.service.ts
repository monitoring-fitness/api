import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserSignupDto } from 'src/core/dto';
import { ResponseError } from 'src/common/dto/response.dto';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
import { User } from './schema/user.schema';
import { Iuser } from './interface/user.interface';
import { UserSigninDto } from './dto/user-signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<Iuser>,
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
