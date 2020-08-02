import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '@libs/db/model/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserDto } from './dto/user.dto';
import { UserRole } from '@libs/db/model/userRole.model';
import { Role } from '@libs/db/model/role.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
              @InjectModel(UserRole) private readonly userRoleModel: ReturnModelType<typeof UserRole>,
              @InjectModel(Role) private readonly roleModel: ReturnModelType<typeof Role>) {
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
    const users = await this.userModel.find(condition).sort(sort).skip(skipNum).limit(parseInt(pageSize)).lean();

    const result = [];
    for (const user of users) {
      const userRoleList = await this.userRoleModel.find({ user: user }).populate('role').lean();
      const roleList = [];
      userRoleList.forEach(ur => {
        roleList.push(ur.role);
      });
      const obj = Object.assign({}, { role: roleList }, user);
      result.push(obj);
    }
    return {
      total: total,
      data: result,
    };
  }

  async createUsers(users: any) {
    const { username, password, role } = users;
    const user = await this.userModel.create({ username, password });
    if (role.length > 0) {
      for (const roleId of role) {
        const roleObj = await this.roleModel.findById(roleId);
        await this.userRoleModel.create({ user: user, role: roleObj });
      }
    }
    return {
      result: true,
      message: '插入成功',
    };
  }

  async updateUsers(id: any, users: any) {
    const { username, role } = users;
    const user = await this.userModel.findByIdAndUpdate({ _id: id }, { username: username }, { new: true });
    if (role.length > 0) {
      await this.userRoleModel.deleteMany({ user: user });
      for (const roleId of role) {
        const roleObj = await this.roleModel.findById(roleId);
        await this.userRoleModel.create({ user: user, role: roleObj });
      }
    }
    return {
      result: true,
      message: '修改成功',
    };
  }

  async deleteUsers(id: any) {
    const user = await this.userModel.findByIdAndDelete(id);
    await this.userRoleModel.deleteMany({ user: user });
    return {
      result: true,
      message: '删除成功',
    };
  }
}
