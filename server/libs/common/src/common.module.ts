import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '@libs/db';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@app/common/auth/local.strategy';
import { JwtStrategy } from '@app/common/auth/jwt.strategy';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from '@app/common/filters/http-exception.filter';
import { SysAuthGuard } from '@app/common/auth/sys-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory() {
        return {
          secret: process.env.SECRET,
          // signOptions: { expiresIn: '8h' }, // token 过期时效
        };
      },
    }),
    DbModule,
    PassportModule,
  ],
  providers: [
    CommonService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    //    设置全局守卫，useClass为自定义的Guard
    {
      provide: APP_GUARD,
      useClass: SysAuthGuard,
    }],
  exports: [CommonService, JwtModule],
})
export class CommonModule {
}
