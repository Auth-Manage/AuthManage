import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '@libs/db/model/user.model';
import { ReturnModelType } from '@typegoose/typegoose';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User) private userModel: ReturnModelType<typeof User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    } as StrategyOptions);
  }

  async validate(id) {
    // console.log('jwt', id, id.length);
    const user = await this.userModel.findById(id);
    return user;
  }
}
