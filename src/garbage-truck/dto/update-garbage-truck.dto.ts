import { PartialType } from '@nestjs/mapped-types';
import { CreateGarbageTruckDto } from './create-garbage-truck.dto';

export class UpdateGarbageTruckDto extends PartialType(CreateGarbageTruckDto) {}
