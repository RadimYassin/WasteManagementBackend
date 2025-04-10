import { 
    IsString, 
    IsMongoId, 
    IsBoolean, 
    IsNumber, 
    Min, 
    IsEnum, 
    IsDate 
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  // Define Garbage Truck Status Enum
  export enum GarbageTruckStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    MAINTENANCE = 'MAINTENANCE',
  }
  
  // Create DTO for GarbageTruck
  export class CreateGarbageTruckDto {
    @IsString({ message: 'License number must be a string' })
    licenseNumber: string;
  
    @IsString({ message: 'Vehicle ID must be a string' })
    vehicleId: string;
  
    @IsBoolean({ message: 'isAvailable must be a boolean' })
    isAvailable: boolean;
  
    @IsNumber({}, { message: 'Latitude must be a number' })
    currentLat: number;
  
    @IsNumber({}, { message: 'Longitude must be a number' })
    currentLng: number;
  
    @IsNumber({}, { message: 'Speed must be a number' })
    @Min(0, { message: 'Speed cannot be negative' })
    speed: number;
  
    @IsEnum(GarbageTruckStatus, { message: 'Invalid status' })
    status: GarbageTruckStatus;
  
  
  
    @IsMongoId({ message: 'Invalid driver ID' })
    driverId: string;
  }
  