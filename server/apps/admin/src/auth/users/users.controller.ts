import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { User, UserDocument } from '@libs/db/model/user.model';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { UsersService } from './users.service';
import { NoAuth } from '@app/common/decorator/no-auth.decorator';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from '@app/common/decorator/current-user.decorator';
import { JwtService } from '@nestjs/jwt';

@ApiTags('用户')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User) private readonly model: ReturnModelType<typeof User>,
    private readonly usersService: UsersService,
  ) {
  }

  @Post('register')
  @NoAuth('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() dto: UserDto) {
    const { username, password } = dto;
    const user = await this.usersService.findUserByName(username);
    if (user) {
      return {
        result: false,
        data: '',
        message: '用户已经存在',
      };
    }
    const newUser = await this.usersService.createUser(dto);
    return {
      result: true,
      data: newUser,
    };
  }

  @Post('login')
  @NoAuth('login')
  @ApiOperation({ summary: '登录' })
  async login(@Body() dto: UserDto, @CurrentUser() user: UserDocument) {
    return {
      result: true,
      token: this.jwtService.sign(String(user._id)),
    };
  }

  @Get('user')
  @ApiOperation({ summary: '获取个人信息' })
  async user(@CurrentUser() user: UserDocument) {
    return user;
  }

  @Get('getInfo')
  @ApiOperation({ summary: '获取系统信息' })
  async getInfo(@CurrentUser() user: UserDocument) {
    const { username } = user;
    return {
      username: username,
      roles: ['admin'],
    };
  }

  @Get('')
  @ApiOperation({ summary: '查询用户信息' })
  async getUsers(@Query() query) {
    const users = await this.usersService.getUsers(query);
    return users;
  }

  @Post('')
  @ApiOperation({ summary: '创建用户' })
  async createUser(@Body() users) {
    return await this.usersService.createUsers(users);
  }

  @Put(':id')
  @ApiOperation({ summary: 'update' })
  async updateUser(@Param('id') id, @Body() users) {
    return await this.usersService.updateUsers(id, users);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete' })
  async deleteUser(@Param('id') id, @Query() query) {
    return await this.usersService.deleteUsers(id);
  }
}
