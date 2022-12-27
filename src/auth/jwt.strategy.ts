import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { IJwtPayload } from 'src/core/interface';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topawesomesecret',
    });
  }

  // CONTINUE: 这个是做什么的？
  async validate(payload: IJwtPayload) {
    const { username } = payload;
    return username;
  }
}
