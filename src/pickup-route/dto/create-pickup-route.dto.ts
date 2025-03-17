import { 
    IsString, 
    IsMongoId, 
    IsInt, 
    Min, 
    IsArray, 
    ArrayNotEmpty 
  } from 'class-validator';
  
  // Create PickupRoute DTO
  export class CreatePickupRouteDto {
    @IsMongoId({ message: 'Invalid assigned truck ID' })
    assignedTruckId: string;
  
    @IsMongoId({ message: 'Invalid assigned driver ID' })
    assignedDriverId: string;
  
    @IsInt({ message: 'Estimated duration must be an integer' })
    @Min(1, { message: 'Estimated duration must be at least 1 minute' })
    estimatedDuration: number;
  
    @IsString({ message: 'Route name must be a string' })
    routeName: string;
  
    @IsArray({ message: 'Bins must be an array of IDs' })
    @ArrayNotEmpty({ message: 'At least one bin must be assigned to the route' })
    @IsMongoId({ each: true, message: 'Invalid bin ID in the list' })
    binIds: string[];
  }
  