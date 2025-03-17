import { Injectable } from '@nestjs/common';
import { CreateGarbageTruckDto } from './dto/create-garbage-truck.dto';
import { UpdateGarbageTruckDto } from './dto/update-garbage-truck.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class GarbageTruckService {
  constructor(private readonly database:PrismaService ){}
  create(CreateGarbageTruckDto: CreateGarbageTruckDto) {
    return this.database.garbageTruck.create({
      data:CreateGarbageTruckDto
    });
  }

  findAll() {
    return this.database.garbageTruck.findMany({

      include:{
        collections:true,
        driver:true,
        PickupRoute:true
      }
    })
  }

  findOne(id: string) {
    return this.database.garbageTruck.findUnique({
      where:{
        id,
      }
    });
  }

  update(id: string, UpdateGarbageTruckDto: UpdateGarbageTruckDto) {
    return this.database.garbageTruck.update({
      where:{
        id,
      },
      data:UpdateGarbageTruckDto
    });
  }

  remove(id: string) {
    return this.database.garbageTruck.delete({
      where:{
        id,
      }
    });
  }
}
