import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import axios from "axios";

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  // получение внешнего ip
  /*
  process.env.EXTERNAL_IP = (await axios.request({
    url: 'https://icanhazip.com',
    method: 'GET'
  })).data
  console.log(process.env.EXTERNAL_IP)
  */
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder().setTitle('Парсер xlsx для Case.One')
    .setDescription('Документация REST API')
    .setVersion('1').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document)

  app.enableCors();
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
