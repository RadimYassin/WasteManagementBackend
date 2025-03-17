import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly database:PrismaService){}
  async create(createReportDto: CreateReportDto) {
    return await this.database.report.create({
      data:createReportDto
    });
  }

  async findAll() {
    return await this.database.report.findMany({}) ;
  }

  async findOne(id: string) {
    return await this.database.report.findUnique({
      where:{
        id,
      }
    });
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    return   await this.database.report.update({
      where:{
        id,
      },
      data:updateReportDto
    });
  }

  async remove(id: string) {
    return await this.database.report.delete({
      where:{
        id,
      }
    }) ;
  }
}
