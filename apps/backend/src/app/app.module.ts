import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthenticationModule,
    MongooseModule.forRoot('mongodb://localhost:27017/taskOrganizer'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
