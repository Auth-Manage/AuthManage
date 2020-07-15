import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from '@libs/db/model/user.model';
import { Role } from '@libs/db/model/role.model';
import { Menu } from '@libs/db/model/menu.model';
import { UserRole } from '@libs/db/model/userRole.model';
import { RoleMenu } from '@libs/db/model/roleMenu.model';

const models = TypegooseModule.forFeature([
  User,
  Role,
  Menu,
  UserRole,
  RoleMenu,
]);

@Global()
@Module({
  imports: [
    TypegooseModule.forRootAsync({
      useFactory() {
        return {
          uri: process.env.DB,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        };
      },
    }),
    models,
  ],
  providers: [DbService],
  exports: [DbService, models],
})
export class DbModule {
}
