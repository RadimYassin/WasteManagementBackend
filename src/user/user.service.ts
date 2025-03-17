import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(private readonly dataBase:PrismaService){}
  create(CreateUserDto:CreateUserDto ) {
    return this.dataBase.user.create({
      data:CreateUserDto
    }) ;
  }

  findAll() {
    return this.dataBase.user.findMany();
  }

  findOne(id: string) {
    return this.dataBase.user.findUnique({
      where:{
        id:id
      }
    });
  }

  update(id: string, UpdateUserDto: UpdateUserDto) {
    return this.dataBase.user.update({
      data:UpdateUserDto,
      where:{
        id:id
      }
    });
  }

  remove(id: string) {
    return  this.dataBase.user.delete({
      where:{
        id,
      }
    });
  }
}
