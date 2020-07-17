import { DocumentType, modelOptions, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { hashSync } from 'bcryptjs';

export type UserDocument = DocumentType<User>

@modelOptions({
  schemaOptions: {
    timestamps: true,
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
