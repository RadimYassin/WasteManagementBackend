import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly database: PrismaService) {}
  
  async create(createReportDto: CreateReportDto) {
    try {
      // Verify if bin exists
      const bin = await this.database.bin.findUnique({
        where: { id: createReportDto.binId }
      });
      
      if (!bin) {
        throw new HttpException('Bin not found', HttpStatus.NOT_FOUND);
      }
      
      // Verify if user exists
      const user = await this.database.user.findUnique({
        where: { id: createReportDto.userId }
      });
      
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      
      // If assignedAdminId is provided, verify if admin exists
      if (createReportDto.assignedAdminId) {
        const admin = await this.database.user.findUnique({
          where: { 
            id: createReportDto.assignedAdminId,
            role: 'ADMIN' 
          }
        });
        
        if (!admin) {
          throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
        }
      }
      
      return await this.database.report.create({
        data: createReportDto
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Failed to create report', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      return await this.database.report.findMany({
        include: {
          bin: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          },
       
          
        }
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to fetch reports', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string) {
    try {
      const report = await this.database.report.findUnique({
        where: { id },
        include: {
          bin: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
            
          },
          assignedAdmin: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        
         
          
        }
      });
      
      if (!report) {
        throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
      }
      
      return report;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Failed to fetch report', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    try {
      // Check if report exists
      await this.findOne(id);
      
      // If binId is provided, verify if bin exists
      if (updateReportDto.binId) {
        const bin = await this.database.bin.findUnique({
          where: { id: updateReportDto.binId }
        });
        
        if (!bin) {
          throw new HttpException('Bin not found', HttpStatus.NOT_FOUND);
        }
      }
      
      // If userId is provided, verify if user exists
      if (updateReportDto.userId) {
        const user = await this.database.user.findUnique({
          where: { id: updateReportDto.userId }
        });
        
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      }
      
      // If assignedAdminId is provided, verify if admin exists
      if (updateReportDto.assignedAdminId) {
        const admin = await this.database.user.findUnique({
          where: { 
            id: updateReportDto.assignedAdminId,
            role: 'ADMIN' 
          }
        });
        
        if (!admin) {
          throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
        }
      }
      
      return await this.database.report.update({
        where: { id },
        data: updateReportDto
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Failed to update report', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {
    try {
      // Check if report exists
      await this.findOne(id);
      
      return await this.database.report.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Failed to delete report', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
