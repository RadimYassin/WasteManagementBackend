import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePickupRouteDto } from './dto/create-pickup-route.dto';
import { UpdatePickupRouteDto } from './dto/update-pickup-route.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PickupRouteService {
  constructor(private readonly database: PrismaService) {}

  async create(CreatePickupRouteDto: CreatePickupRouteDto) {
    try {
      // Verify if truck exists
      const truck = await this.database.garbageTruck.findUnique({
        where: { id: CreatePickupRouteDto.assignedTruckId }
      });
      
      if (!truck) {
        throw new HttpException('Garbage truck not found', HttpStatus.NOT_FOUND);
      }
      
      // Verify if driver exists and is a driver
      const driver = await this.database.user.findUnique({
        where: { 
          id: CreatePickupRouteDto.assignedDriverId,
          role: 'DRIVER'
        }
      });
      
      if (!driver) {
        throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
      }
      
      // Verify if all bins exist
      if (CreatePickupRouteDto.binIds && CreatePickupRouteDto.binIds.length > 0) {
        for (const binId of CreatePickupRouteDto.binIds) {
          const bin = await this.database.bin.findUnique({
            where: { id: binId }
          });
          
          if (!bin) {
            throw new HttpException(`Bin with ID ${binId} not found`, HttpStatus.NOT_FOUND);
          }
        }
      }
      
      // Create the pickup route with connected bins
      return await this.database.pickupRoute.create({
        data: {
          assignedTruckId: CreatePickupRouteDto.assignedTruckId,
          assignedDriverId: CreatePickupRouteDto.assignedDriverId,
          estimatedDuration: CreatePickupRouteDto.estimatedDuration,
          routeName: CreatePickupRouteDto.routeName,
          bins: {
            connect: CreatePickupRouteDto.binIds.map(id => ({ id }))
          }
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Failed to create pickup route', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      return await this.database.pickupRoute.findMany({
        include: {
          bins: true,
          assignedDriver: true,
          assignedTruck: true
        }
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to fetch pickup routes', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string) {
    try {
      const route = await this.database.pickupRoute.findUnique({
        where: { id },
        include: {
          bins: true,
          assignedDriver: true,
          assignedTruck: true
        }
      });
      
      if (!route) {
        throw new HttpException('Pickup route not found', HttpStatus.NOT_FOUND);
      }
      
      return route;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Failed to fetch pickup route', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, UpdatePickupRouteDto: UpdatePickupRouteDto) {
    try {
      // Check if route exists
      await this.findOne(id);
      
      // If truck ID is provided, verify if truck exists
      if (UpdatePickupRouteDto.assignedTruckId) {
        const truck = await this.database.garbageTruck.findUnique({
          where: { id: UpdatePickupRouteDto.assignedTruckId }
        });
        
        if (!truck) {
          throw new HttpException('Garbage truck not found', HttpStatus.NOT_FOUND);
        }
      }
      
      // If driver ID is provided, verify if driver exists and is a driver
      if (UpdatePickupRouteDto.assignedDriverId) {
        const driver = await this.database.user.findUnique({
          where: { 
            id: UpdatePickupRouteDto.assignedDriverId,
            role: 'DRIVER'
          }
        });
        
        if (!driver) {
          throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
        }
      }
      
      // If bin IDs are provided, verify if all bins exist
      if (UpdatePickupRouteDto.binIds && UpdatePickupRouteDto.binIds.length > 0) {
        for (const binId of UpdatePickupRouteDto.binIds) {
          const bin = await this.database.bin.findUnique({
            where: { id: binId }
          });
          
          if (!bin) {
            throw new HttpException(`Bin with ID ${binId} not found`, HttpStatus.NOT_FOUND);
          }
        }
        
        // Update the route with new bins
        return await this.database.pickupRoute.update({
          where: { id },
          data: {
            assignedTruckId: UpdatePickupRouteDto.assignedTruckId,
            assignedDriverId: UpdatePickupRouteDto.assignedDriverId,
            estimatedDuration: UpdatePickupRouteDto.estimatedDuration,
            routeName: UpdatePickupRouteDto.routeName,
            bins: {
              set: [], // Clear existing connections
              connect: UpdatePickupRouteDto.binIds.map(id => ({ id })) // Connect new bins
            }
          }
        });
      }
      
      // Update without changing bins
      return await this.database.pickupRoute.update({
        where: { id },
        data: {
          assignedTruckId: UpdatePickupRouteDto.assignedTruckId,
          assignedDriverId: UpdatePickupRouteDto.assignedDriverId,
          estimatedDuration: UpdatePickupRouteDto.estimatedDuration,
          routeName: UpdatePickupRouteDto.routeName
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Failed to update pickup route', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {
    try {
      // Check if route exists
      await this.findOne(id);
      
      return await this.database.pickupRoute.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Failed to delete pickup route', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

