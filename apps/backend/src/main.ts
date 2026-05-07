import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OpenFeature } from "@openfeature/server-sdk";
import { FlagdProvider } from "@openfeature/flagd-provider";

async function bootstrap() {
  await OpenFeature.setProviderAndWait(
    new FlagdProvider({
      host: process.env.FLAGD_HOST ?? "localhost",
      port: Number(process.env.FLAGD_PORT ?? 8013),
    }),
  );

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
