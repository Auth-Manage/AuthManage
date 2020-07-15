import { User } from '@libs/db/model/user.model';
import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Role } from '@libs/db/model/role.model';
import { ApiProperty } from '@nestjs/swagger';

@modelOptions({
  schemaOptions: {
    timestamps: true
  },
})
export class UserRole {
  @ApiProperty({description:'用户'})
  @prop({ ref: 'User' })
  user: Ref<User>;

  @ApiProperty({description:'角色'})
  @prop({ ref: 'Role' })
  role: Ref<Role>;
}
