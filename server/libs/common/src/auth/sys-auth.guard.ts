import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';

const whiteList = ['register', 'noAuth'];

@Injectable()
export class SysAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //    在这里取metadata中的no-auth，得到的会是一个bool
    const noAuth = this.reflector.get<string>('no-auth', context.getHandler());
    if (whiteList.includes(noAuth)) {
      return true;
    } else {
      const guard = SysAuthGuard.getAuthGuard(noAuth);
      return guard.canActivate(context);    //    执行所选策略Guard的canActivate方法
    }

  }

//    根据NoAuth的t/f选择合适的策略Guard
  private static getAuthGuard(noAuth: string): IAuthGuard {
    // console.log(noAuth);
    if (noAuth === 'login') {
      return new (AuthGuard('local'))();
    } else {
      return new (AuthGuard('jwt'))();
    }
  }
}
