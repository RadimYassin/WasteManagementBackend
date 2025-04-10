import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BinService {
  constructor(private readonly database:PrismaService ){}
  
  async create(CreateBinDto: CreateBinDto) {
    try {
      // Check if bin with similar coordinates already exists
      const existingBin = await this.database.bin.findFirst({
        where: {
          AND: [
            { currentLat: CreateBinDto.currentLat },
            { currentLng: CreateBinDto.currentLng }
          ]
        }
      });

      if (existingBin) {
        throw new ConflictException('A bin already exists at these coordinates');
      }

      // Create new bin if no existing bin found
      return await this.database.bin.create({
        data: CreateBinDto
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create bin: ' + error.message);
    }
  }

  findAll() {
    return this.database.bin.findMany({
      include:{
        collections:true,
        sensors:true,
        route:true
      }
    })
  }

  async findOne(id: string) {
    try {
      const bin = await this.database.bin.findUnique({
        where: {
          id,
        }
      });
      
      if (!bin) {
        throw new NotFoundException(`Bin with ID ${id} not found`);
      }
      
      return bin;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to find bin: ' + error.message);
    }
  }

  update(id: string, UpdateBinDto: UpdateBinDto) {
    return this.database.bin.update({
      where:{
        id,
      },
      data:UpdateBinDto
    });
  }

  remove(id: string) {
    return this.database.bin.delete({
      where:{
        id,
      }
    });
  }



  async findFullBin() {
    const bins = await this.database.bin.findMany({
      where: {
        status: "FULL", 
      },
      select:{
        currentLat:true,
        currentLng:true
      }
    });
  
    return bins; 
  }
}
