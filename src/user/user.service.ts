import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(private readonly dataBase:PrismaService){}
  async create(CreateUserDto:CreateUserDto ) {

    const user = await this.dataBase.user.findUnique({
      where: {
        email: CreateUserDto.email,
      },
    });
  
    if (user) {
      throw new HttpException(
        { message: "user is  exist." }, 
        HttpStatus.FOUND
      );
    }

    return this.dataBase.user.create({
      data:CreateUserDto
    }) ;




  }

  findAll() {
    return this.dataBase.user.findMany();
  }

  async findOne(id: string) {
  const user=  await this.dataBase.user.findUnique({
      where:{
        id:id
      }
    });


    if(!user){
      throw new HttpException(
        { message: "user is not found." }, 
        HttpStatus.NOT_FOUND
      );
    }

    return user
  }

  async update(id: string, UpdateUserDto: UpdateUserDto) {

    const user= await this.findOne(id)


    if (!user) {
      throw new HttpException(
        { message: "user is not found." }, 
        HttpStatus.NOT_FOUND
      );
    }
    return this.dataBase.user.update({
      data:UpdateUserDto,
      where:{
        id:id
      }
    });
  }

  async remove(id: string) {

  const user= await this.findOne(id)


  if (!user) {
    throw new HttpException(
      { message: "user is not found." }, 
      HttpStatus.NOT_FOUND
    );
  }

    return  this.dataBase.user.delete({
      where:{
        id,
      }
    });
  }
}
