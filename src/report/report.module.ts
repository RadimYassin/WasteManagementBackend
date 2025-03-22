import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  controllers: [ReportController],
  providers: [ReportService,PrismaService],
})
export class ReportModule {}
