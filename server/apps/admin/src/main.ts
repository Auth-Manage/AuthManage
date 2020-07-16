import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@app/common/filters/http-exception.filter';
import { TransFormInterceptor } from '@app/common/interceptor/trans-form.interceptor';
import { AllExceptionFilter } from '@app/common/filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new TransFormInterceptor());
  const options = new DocumentBuilder()
    .setTitle('权限管理系统-后台管理API')
    .setDescription('供后台管理界面调用服务API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  const PORT = process.env.ADMIN_PORT || 3009;
  await app.listen(PORT);
  console.log(`http://localhost:${PORT}/api-docs`);
}

bootstrap();
