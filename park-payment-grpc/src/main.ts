import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'payment',
      protoPath: process.env.PROTO_PATH || join(__dirname, '../../proto/payment.proto'),
      url: '0.0.0.0:5000'
    }
  })

  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
