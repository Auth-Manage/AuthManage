import {modelOptions, prop, Ref} from '@typegoose/typegoose';
import {ApiProperty} from '@nestjs/swagger';

@modelOptions({
    schemaOptions: {
        timestamps: true,
        toJSON: {virtuals: true}
    },
})
export class Menu {
    @ApiProperty({description: '菜单名'})
    @prop({required: true, unique: true})
    name: string;

    @ApiProperty({description: '菜单编码'})
    @prop({required: true, unique: true})
    code: string;

    @ApiProperty({description: '父菜单'})
    @prop({ref: 'Menu'})
    parent: Ref<Menu> | null;

    @ApiProperty({description: '序号'})
    @prop()
    order: number;

    @ApiProperty({description: '描述'})
    @prop()
    desc: string;

    @prop({
        ref: 'Menu',
        foreignField: 'parent',
        localField: '_id',
        justOne: false,
    })
    children: Ref<Menu>;
}
