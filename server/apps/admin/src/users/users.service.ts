import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '@libs/db/model/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>) {
  }

  async findUserByName(username: string) {
    const user = await this.userModel.findOne({ username: username });
    return user;
  }

  async createUser(userDto: UserDto) {
    const user = await this.userModel.create(userDto);
    return user;
  }
}
