import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class CollectionService {
  constructor(private readonly database:PrismaService ){}
  create(CreateCollectionDto: CreateCollectionDto) {
    return this.database.collection.create({
      data:CreateCollectionDto
    });
  }

  findAll() {
    return this.database.collection.findMany({})
  }

  findOne(id: string) {
    return this.database.collection.findUnique({
      where:{
        id,
      }
    });
  }

  update(id: string, UpdateCollectionDto: UpdateCollectionDto) {
    return this.database.collection.update({
      where:{
        id,
      },
      data:UpdateCollectionDto
    });
  }

  remove(id: string) {
    return this.database.collection.delete({
      where:{
        id,
      }
    });
  }
}

