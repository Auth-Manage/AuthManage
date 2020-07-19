import { Body, Controller, Get, Post } from '@nestjs/common';
import { Crud } from 'nestjs-mongoose-crud';
import { User, UserDocument } from '@libs/db/model/user.model';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { UsersService } from './users.service';
import { NoAuth } from '@app/common/decorator/no-auth.decorator';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from '@app/common/decorator/current-user.decorator';
import { JwtService } from '@nestjs/jwt';

@Crud({
  model: User,
})
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
}
