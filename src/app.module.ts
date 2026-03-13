import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { FundModule } from './fund/fund.module';

import * as fs from 'fs';
import * as path from 'path';
import { Module } from '@nestjs/common';
// import { LoggerService } from './config/logger.config';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir) && process.env.NODE_ENV !== 'production') {
  fs.mkdirSync(logsDir);
}

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local'],
    }),
    ScheduleModule.forRoot(),
    FundModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
