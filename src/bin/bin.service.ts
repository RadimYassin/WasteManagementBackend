import { Injectable } from '@nestjs/common';
import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BinService {
  constructor(private readonly database:PrismaService ){}
  create(CreateBinDto: CreateBinDto) {
    return this.database.bin.create({
      data:CreateBinDto
    });
  }

  findAll() {
    return this.database.bin.findMany({})
  }

  findOne(id: string) {
    return this.database.bin.findUnique({
      where:{
        id,
      }
    });
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
}
