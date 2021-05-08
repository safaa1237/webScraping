import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TitleModule } from './title/title.module';

@Module({
  imports: [TitleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
