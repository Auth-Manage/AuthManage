import { Controller } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Menu } from '@libs/db/model/menu.model';
import { Crud } from 'nestjs-mongoose-crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Crud({
  model:Menu
})
@ApiTags('菜单')
@Controller('menus')
@ApiBearerAuth()
export class MenusController {
  constructor(@InjectModel(Menu) private readonly model:ReturnModelType<typeof Menu>) {
  }
}
