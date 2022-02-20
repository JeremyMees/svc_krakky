import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { TokenModel } from 'src/auth/models/token.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: (req) => {
        const token: any = this.jwtService.decode(
          req.cookies['krakkyAccessToken'],
        );
        if (!req || !req.cookies) {
          return null;
        } else {
          if (
            token &&
            token.token_expire_time &&
            token.token_expire_time - Date.now() > 0
          ) {
            return req.cookies['krakkyAccessToken'];
          } else {
            return null;
          }
        }
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_CONSTANT'),
    });
  }

  async validate(payload: any) {
    const user = await this.authService.getUser(payload.id, false);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
