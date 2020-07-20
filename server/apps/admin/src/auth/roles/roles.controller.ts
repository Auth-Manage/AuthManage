import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud } from 'nestjs-mongoose-crud';
import { Role } from '@libs/db/model/role.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Crud({
  model:Role
})
@ApiTags('角色')
@Controller('roles')
@ApiBearerAuth()
export class RolesController {
  constructor(@InjectModel(Role) private readonly model:ReturnModelType<typeof Role>) {
  }
}
