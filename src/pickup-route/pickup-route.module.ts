import { Module } from '@nestjs/common';
import { PickupRouteService } from './pickup-route.service';
import { PickupRouteController } from './pickup-route.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PickupRouteController],
  providers: [PickupRouteService,PrismaService],
})
export class PickupRouteModule {}
