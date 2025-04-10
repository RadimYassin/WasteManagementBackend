import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { PickupRouteService } from './pickup-route.service';
import { CreatePickupRouteDto } from './dto/create-pickup-route.dto';
import { UpdatePickupRouteDto } from './dto/update-pickup-route.dto';

@Controller('pickup-route')
export class PickupRouteController {
  constructor(private readonly pickupRouteService: PickupRouteService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true })) 

  create(@Body() createPickupRouteDto: CreatePickupRouteDto) {
    return this.pickupRouteService.create(createPickupRouteDto);
  }

  @Get()
  findAll() {
    return this.pickupRouteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pickupRouteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePickupRouteDto: UpdatePickupRouteDto) {
    return this.pickupRouteService.update(id, updatePickupRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pickupRouteService.remove(id);
  }
}
