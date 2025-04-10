import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SensorService {
  constructor(private readonly database: PrismaService) {}

  async create(createSensorDto: CreateSensorDto) {
    try {
      // Check if bin exists
      const bin = await this.database.bin.findUnique({
        where: {
          id: createSensorDto.binId,
        },
      });

      if (!bin) {
        throw new HttpException(
          { message: "Bin not found" },
          HttpStatus.NOT_FOUND
        );
      }

      return await this.database.sensor.create({
        data: createSensorDto
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: "Failed to create sensor", error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      return await this.database.sensor.findMany({
        include: {
          bin: true
        }
      });
    } catch (error) {
      throw new HttpException(
        { message: "Failed to fetch sensors", error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string) {
    try {
      const sensor = await this.database.sensor.findUnique({
        where: {
          id,
        }
      });

      if (!sensor) {
        throw new HttpException(
          { message: "Sensor not found" },
          HttpStatus.NOT_FOUND
        );
      }

      return sensor;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: "Failed to fetch sensor", error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, updateSensorDto: UpdateSensorDto) {
    try {
      // Check if sensor exists
      const sensor = await this.findOne(id);
      if (!sensor) {
        throw new HttpException(
          { message: "sensor not found" },
          HttpStatus.NOT_FOUND
        );
      }
      // If binId is provided, check if bin exists
      if (updateSensorDto.binId) {
        const bin = await this.database.bin.findUnique({
          where: {
            id: updateSensorDto.binId,
          },
        });

      

      if (!bin) {
        throw new HttpException(
          { message: "Bin not found" },
          HttpStatus.NOT_FOUND
        );
      }
    }

    

      return await this.database.sensor.update({
        where: {
          id,
        },
        data: updateSensorDto
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: "Failed to update sensor", error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {
    try {
      // Check if sensor exists
      await this.findOne(id);

      return await this.database.sensor.delete({
        where: {
          id,
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: "Failed to delete sensor", error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
