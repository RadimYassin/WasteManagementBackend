import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(private readonly dataBase:PrismaService){}
  async create(CreateUserDto:CreateUserDto ) {
    try {
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
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: "Failed to create user", error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      return await this.dataBase.user.findMany();
    } catch (error) {
      throw new HttpException(
        { message: "Failed to fetch users", error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.dataBase.user.findUnique({
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

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: "Failed to fetch user", error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, UpdateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new HttpException(
          { message: "user is not found." }, 
          HttpStatus.NOT_FOUND
        );
      }
      
      return await this.dataBase.user.update({
        data: UpdateUserDto,
        where: {
          id: id
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: "Failed to update user", error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new HttpException(
          { message: "user is not found." }, 
          HttpStatus.NOT_FOUND
        );
      }

      return await this.dataBase.user.delete({
        where: {
          id,
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: "Failed to delete user", error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
