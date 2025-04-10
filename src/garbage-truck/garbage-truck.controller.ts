import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { GarbageTruckService } from './garbage-truck.service';
import { CreateGarbageTruckDto } from './dto/create-garbage-truck.dto';
import { UpdateGarbageTruckDto } from './dto/update-garbage-truck.dto';

@Controller('garbage-truck')
export class GarbageTruckController {
  constructor(private readonly garbageTruckService: GarbageTruckService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true })) 

  create(@Body() createGarbageTruckDto: CreateGarbageTruckDto) {
    return this.garbageTruckService.create(createGarbageTruckDto);
  }

  @Get()
  findAll() {
    return this.garbageTruckService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.garbageTruckService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGarbageTruckDto: UpdateGarbageTruckDto) {
    return this.garbageTruckService.update(id, updateGarbageTruckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.garbageTruckService.remove(id);
  }
}
