import { Module } from '@nestjs/common';
import { BinService } from './bin.service';
import { BinController } from './bin.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BinController],
  providers: [BinService,PrismaService],
})
export class BinModule {}
