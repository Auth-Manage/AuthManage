import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '@app/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UsersModule } from './users/users.module';
import * as dayjs from 'dayjs';
import * as nuid from 'nuid';

@Module({
  imports: [
    CommonModule,
    MulterModule.register({
      storage: diskStorage({
        //自定义路径
        destination: `./uploads/${dayjs().format('YYYY-MM-DD')}`,
        filename: (req, file, cb) => {
          // 自定义文件名
          const filename = `${nuid.next()}.${file.mimetype.split('/')[1]}`;
          return cb(null, filename);
          // return cb(null, file.originalname);
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
