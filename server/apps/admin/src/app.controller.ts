import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NoAuth } from '@app/common/decorator/no-auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  @NoAuth('noAuth')
  getHello(): string {
    return this.appService.getHello();
  }
}
