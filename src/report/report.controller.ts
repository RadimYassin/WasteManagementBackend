import { 
  Controller, Post, Get, Patch, Delete, Param, Body, UseInterceptors, UploadedFile, HttpException, HttpStatus, 
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { unlinkSync, existsSync } from 'fs';
import { extname } from 'path';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // ✅ Create a report with file upload
  @Post()
    @UsePipes(new ValidationPipe({ transform: true })) 
  
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads', 
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createReportDto: CreateReportDto) {
    try {
      if (file) {
        createReportDto.image = `/uploads/${file.filename}`;
      }
      return await this.reportService.create(createReportDto);
    } catch (error) {
      throw new HttpException('Error creating report', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ Retrieve all reports
  @Get()
  async findAll() {
    return await this.reportService.findAll();
  }

  // ✅ Retrieve a single report by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const report = await this.reportService.findOne(id);
    if (!report) {
      throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
    }
    return report;
  }

  // ✅ Update a report (including image update)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateReportDto: UpdateReportDto
  ) {
    try {
      const existingReport = await this.reportService.findOne(id);
      if (!existingReport) {
        throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
      }

      // If a new file is uploaded, delete the old file (if it exists)
      if (file) {
        if (existingReport.image) {
          const oldImagePath = `.${existingReport.image}`; // Convert to relative path
          if (existsSync(oldImagePath)) {
            unlinkSync(oldImagePath); // Delete old image
          }
        }
        updateReportDto.image = `/uploads/${file.filename}`; // Save new image path
      }

      return await this.reportService.update(id, updateReportDto);
    } catch (error) {
      throw new HttpException('Error updating report', HttpStatus.BAD_REQUEST);
    }
  }

  // ✅ Delete a report and remove associated image
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const existingReport = await this.reportService.findOne(id);
      if (!existingReport) {
        throw new HttpException('Report not found', HttpStatus.NOT_FOUND);
      }

      // Delete the associated image if it exists
      if (existingReport.image) {
        const imagePath = `.${existingReport.image}`;
        if (existsSync(imagePath)) {
          unlinkSync(imagePath);
        }
      }

      return await this.reportService.remove(id);
    } catch (error) {
      throw new HttpException('Error deleting report', HttpStatus.BAD_REQUEST);
    }
  }
}
