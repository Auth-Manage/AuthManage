import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Role } from '@libs/db/model/role.model';
import { Menu } from '@libs/db/model/menu.model';
import { ApiProperty } from '@nestjs/swagger';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
  },
})
export class RoleMenu {
  @ApiProperty({ description: '角色' })
  @prop({ ref: 'Role' })
  role: Ref<Role>;

  @ApiProperty({ description: '菜单' })
  @prop({ ref: 'Menu' })
  menu: Ref<Menu>;
}
