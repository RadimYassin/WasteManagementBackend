import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CollectionService {
  constructor(private readonly database: PrismaService) {}
  
  async create(createCollectionDto: CreateCollectionDto) {
    try {
      // Check if bin exists
      const bin = await this.database.bin.findUnique({
        where: { id: createCollectionDto.binId }
      });

      if (!bin) {
        throw new BadRequestException(`Bin with ID ${createCollectionDto.binId} not found`);
      }

      // Check if driver exists and is available
      const driver = await this.database.user.findUnique({
        where: { id: createCollectionDto.assignedDriverId }
      });

      if (!driver) {
        throw new BadRequestException(`Driver with ID ${createCollectionDto.assignedDriverId} not found`);
      }

      if (driver.isAvailable === false) {
        throw new BadRequestException(`Driver with ID ${createCollectionDto.assignedDriverId} is not available`);
      }

      // Check if truck exists and is available
      const truck = await this.database.garbageTruck.findUnique({
        where: { id: createCollectionDto.assignedTruckId }
      });

      if (!truck) {
        throw new BadRequestException(`Truck with ID ${createCollectionDto.assignedTruckId} not found`);
      }

      if (truck.isAvailable === false) {
        throw new BadRequestException(`Truck with ID ${createCollectionDto.assignedTruckId} is not available`);
      }

      // Create collection
      return await this.database.collection.create({
        data: createCollectionDto
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to create collection: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.database.collection.findMany({
        include: {
          bin: true,
          driver: true,
          truck: true
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch collections: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const collection = await this.database.collection.findUnique({
        where: { id },
        include: {
          bin: true,
          driver: true,
          truck: true
        }
      });

      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }

      return collection;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch collection: ${error.message}`);
    }
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    try {
      // Check if collection exists
      const existingCollection = await this.database.collection.findUnique({
        where: { id }
      });

      if (!existingCollection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }

      // If binId is being updated, check if bin exists
      if (updateCollectionDto.binId) {
        const bin = await this.database.bin.findUnique({
          where: { id: updateCollectionDto.binId }
        });

        if (!bin) {
          throw new BadRequestException(`Bin with ID ${updateCollectionDto.binId} not found`);
        }
      }

      return await this.database.collection.update({
        where: { id },
        data: updateCollectionDto
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update collection: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      // Check if collection exists
      const existingCollection = await this.database.collection.findUnique({
        where: { id }
      });

      if (!existingCollection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }

      return await this.database.collection.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to delete collection: ${error.message}`);
    }
  }
}

