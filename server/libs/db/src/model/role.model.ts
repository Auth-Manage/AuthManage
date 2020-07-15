import { modelOptions, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

@modelOptions({
  schemaOptions: {
    timestamps: true
  },
})
export class Role {
  @ApiProperty({description: '角色名', example: 'role'})
  @prop({required:true,unique:true})
  name: string;

  @ApiProperty({description: '角色编码', example: 'code'})
  @prop()
  code: string;

  @ApiProperty({description: '描述', example: 'desc'})
  @prop()
  desc: string;
}
