import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJwtPayload } from 'src/common/interface/jwt-payload.interface';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topawesomesecret',
    });
  }

  /**
   * AuthGuard 所使用的验证策略
   * @param payload
   */
  async validate(payload: IJwtPayload) {
    debugger;
    const { name } = payload;
    const user: User = await this.userModel.findOne({ name });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
