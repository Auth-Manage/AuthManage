import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthsService } from './auths.service';

@ApiTags('权限')
@ApiBearerAuth()
@Controller('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {
  }


}
