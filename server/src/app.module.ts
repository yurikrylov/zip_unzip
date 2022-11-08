import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FileService } from './file.service';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService,FileService],
})
export class AppModule {}
