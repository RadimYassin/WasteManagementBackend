import { PartialType } from '@nestjs/mapped-types';
import { CreatePickupRouteDto } from './create-pickup-route.dto';

export class UpdatePickupRouteDto extends PartialType(CreatePickupRouteDto) {}
