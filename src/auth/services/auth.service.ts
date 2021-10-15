import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/users/models/user.model';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // const user = await this.userService.findOne(email);
    // if (user && user.password === pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    // return null;
  }

  async login(user: UserModel) {
    // const salt: number = Number(this.configService.get('saltRounds'));
    // const hash: string = await bcrypt.hash(user.password, salt);
    // console.log(hash);
    // bcrypt.compare(user.password, )
    // const payload = { email: user.email, password: hash };
    // return {
    //   access_token: this.jwtService.sign(payload),
    // };
  }
}
