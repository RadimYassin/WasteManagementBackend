import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ZonesService {

  constructor(private readonly database:PrismaService ){}
  async create(createZoneDto: CreateZoneDto) {
    // Check if the assigned admin exists and has role "admin"
    const admin = await this.database.user.findFirst({
      where: {
        id: createZoneDto.assignedAdminId,
        role: "ADMIN", // Ensure the role is "admin"
      },
    });
  
    if (!admin) {
      throw new HttpException(
        { message: "Assigned admin does not exist." }, 
        HttpStatus.BAD_REQUEST
      );
    }


    if (admin.role !== Role.ADMIN) {
      throw new HttpException(
        { message: "User is not an admin." }, 
        HttpStatus.FORBIDDEN
      );
    }
  
    // If the admin is valid, create the zone
    return this.database.zone.create({
      data: createZoneDto,
    });
  }

  findAll() {
    return this.database.zone.findMany({
 select:{
  id:true,
  name:true,
  currentLat:true,
  currentLng:true,
  isActive:true,
  totalBins:true,
  assignedAdmin:{
    select:{
      id:true,
      username:true,
      email:true,
      role:true
    
    }
  }
 }
    
      
    });
  }

  async findOne(id: string) {
    const zone= await this.database.zone.findUnique({
      where:{
        id,
      }
    });

    if(!zone){
      throw new HttpException(
        { message: "zone is not found." }, 
        HttpStatus.NOT_FOUND
      );
    }

    return zone
  }

  async update(id: string, updateZoneDto: UpdateZoneDto) {
   
    const zone= await this.database.zone.findUnique({
      where:{
        id,
      }
    }); 

    if (!zone) {
      throw new HttpException(
        { message: "zone is not found." }, 
        HttpStatus.NOT_FOUND
      );
    }

    return this.database.zone.update({
      where:{
        id,
      },
      data:updateZoneDto
    });
  }

 async remove(id: string) {

  const zone= await this.database.zone.findUnique({
    where:{
      id,
    }
  }); 

  if (!zone) {
    throw new HttpException(
      { message: "zone is not found." }, 
      HttpStatus.NOT_FOUND
    );
  }


    return this.database.zone.delete({
      where:{
        id,
      }
    });
  }
}
