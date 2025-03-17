import { Module } from '@nestjs/common';
import { GarbageTruckService } from './garbage-truck.service';
import { GarbageTruckController } from './garbage-truck.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [GarbageTruckController],
  providers: [GarbageTruckService,PrismaService],
})
export class GarbageTruckModule {}
