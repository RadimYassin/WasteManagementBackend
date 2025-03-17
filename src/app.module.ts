import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ZonesModule } from './zones/zones.module';
import { ReportModule } from './report/report.module';
import { PickupRouteModule } from './pickup-route/pickup-route.module';
import { GarbageTruckModule } from './garbage-truck/garbage-truck.module';
import { CollectionModule } from './collection/collection.module';
import { SensorModule } from './sensor/sensor.module';
import { BinModule } from './bin/bin.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UserModule, ZonesModule, ReportModule, PickupRouteModule, GarbageTruckModule, CollectionModule, SensorModule, BinModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
