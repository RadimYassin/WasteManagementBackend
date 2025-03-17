import { Injectable } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SensorService {
  constructor(private readonly database:PrismaService ){}
  create(createSensorDto: CreateSensorDto) {
    return this.database.sensor.create({
      data:createSensorDto
    });
  }

  findAll() {
    return this.database.sensor.findMany({
      include:{
        bin:true
      }
    })
  }

  findOne(id: string) {
    return this.database.sensor.findUnique({
      where:{
        id,
      }
    });
  }

  update(id: string, updateSensorDto: UpdateSensorDto) {
    return this.database.sensor.update({
      where:{
        id,
      },
      data:updateSensorDto
    });
  }

  remove(id: string) {
    return this.database.sensor.delete({
      where:{
        id,
      }
    });
  }
}
