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

  async getUsers(query: any) {
    const { pageNum = 1, pageSize = 10, username, sort } = query;
    const skipNum = (parseInt(pageNum) - 1) * parseInt(pageSize);
    const condition = {
      $and: [
        { username: { $regex: username, $options: 'i' } },
      ],
    };
    const total = await this.userModel.countDocuments(condition);
    const users = await this.userModel.find(condition).sort(sort).skip(skipNum).limit(pageSize);
    return {
      total: total,
      data: users,
    };
  }
}
