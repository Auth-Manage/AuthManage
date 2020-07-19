import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { RoleMenu } from '@libs/db/model/roleMenu.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserRole } from '@libs/db/model/userRole.model';

@Injectable()
export class AuthsService {
  constructor(@InjectModel(RoleMenu) private readonly roleMenuModel: ReturnModelType<typeof RoleMenu>,
              @InjectModel(UserRole) private readonly userRoleModel: ReturnModelType<typeof UserRole>) {
  }

}
