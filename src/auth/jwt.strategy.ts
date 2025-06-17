import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: process.env.JWT_SECRET || 'easy-market-secret',
});

console.log('JWT_SECRET em uso:', process.env.JWT_SECRET); // VER AQUI

  }

  async validate(payload: any) {
  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role, // se você estiver usando roles
  };
}

}
