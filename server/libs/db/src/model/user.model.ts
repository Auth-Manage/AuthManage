import { DocumentType, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { hashSync } from 'bcryptjs';
import { UserRole } from '@libs/db/model/userRole.model';

export type UserDocument = DocumentType<User>

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
  },
})
export class User {
  @ApiProperty({ description: '用户名', example: 'user' })
  @prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: '密码', example: 'password' })
  @prop({
    select: false,
    get(val) {
      return val;
    },
    set(val) {
      return val ? hashSync(val) : val;
    },
  })
  password: string;
}
