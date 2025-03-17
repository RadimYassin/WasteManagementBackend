import { 
    IsString, 
    IsEnum, 
    IsMongoId, 
    IsDate, 
    IsOptional 
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  // Define Collection Status Enum
  export enum CollectionStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
  }
  
  // Define Collection Method Enum
  export enum CollectionMethod {
    AUTOMATED = 'AUTOMATED',
    MANUAL = 'MANUAL',
  }
  
  // Create Collection DTO
  export class CreateCollectionDto {
    @Type(() => Date)
    @IsDate({ message: 'Invalid timestamp' })
    timestamp: Date;
  
    @IsEnum(CollectionStatus, { message: 'Invalid collection status' })
    status: CollectionStatus;
  
    @IsMongoId({ message: 'Invalid assigned truck ID' })
    assignedTruckId: string;
  
    @IsMongoId({ message: 'Invalid assigned driver ID' })
    assignedDriverId: string;
  
    @IsEnum(CollectionMethod, { message: 'Invalid collection method' })
    collectionMethod: CollectionMethod;
  }
  