import { Injectable } from '@nestjs/common';
import { CreatePickupRouteDto } from './dto/create-pickup-route.dto';
import { UpdatePickupRouteDto } from './dto/update-pickup-route.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PickupRouteService {
  constructor(private readonly database:PrismaService ){}
  create(CreatePickupRouteDto: CreatePickupRouteDto) {
    return this.database.pickupRoute.create({
      data:CreatePickupRouteDto
    });
  }

  findAll() {
    return this.database.pickupRoute.findMany({
      include:{
        bins:true,
        assignedDriver:true,
        assignedTruck:true
      }
    })
  }

  findOne(id: string) {
    return this.database.pickupRoute.findUnique({
      where:{
        id,
      }
    });
  }

  update(id: string, UpdatePickupRouteDto: UpdatePickupRouteDto) {
    return this.database.pickupRoute.update({
      where:{
        id,
      },
      data:UpdatePickupRouteDto
    });
  }

  remove(id: string) {
    return this.database.pickupRoute.delete({
      where:{
        id,
      }
    });
  }
}

