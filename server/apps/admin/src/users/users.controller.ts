import { Controller } from '@nestjs/common';
import { Crud } from 'nestjs-mongoose-crud';
import { User } from '@libs/db/model/user.model';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { UsersService } from './users.service';

@Crud({
  model: User,
})
@ApiTags('用户')
@Controller('users')
export class UsersController {
  constructor(@InjectModel(User) private readonly model: ReturnModelType<typeof User>,
              private readonly usersService: UsersService) {
  }
}
