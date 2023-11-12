import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [AppService],
})
export class AppModule {}
