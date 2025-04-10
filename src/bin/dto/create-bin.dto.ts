import { 
  IsString, 
  IsEnum, 
  IsInt, 
  IsOptional, 
  IsBoolean, 
  IsMongoId, 
  IsDate, 
  IsNotEmpty,
  IsNumber
} from 'class-validator';
import { Type } from 'class-transformer';

// Define Bin Status Enum (Optional)
export enum BinStatus {
  EMPTY = 'EMPTY',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  FULL = 'FULL',
  OVERFLOWING = 'OVERFLOWING',
}

// Define Bin Type Enum (Optional)
export enum BinType {
  ORGANIC = 'ORGANIC',
  RECYCLABLE = 'RECYCLABLE',
  NON_RECYCLABLE = 'NON_RECYCLABLE',
  OTHER = 'OTHER',
}

// Create Bin DTO
export class CreateBinDto {
  @IsNotEmpty()
  @IsNumber({}, { message: 'value must be a valid float' })
  currentLat   :  number;
  @IsNotEmpty()
  @IsNumber({}, { message: 'value must be a valid float' })
  currentLng   :  number;

  @IsEnum(BinStatus, { message: 'Invalid bin status' })
  status: BinStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Invalid lastCollected date' })
  lastCollected?: Date;

  @IsInt({ message: 'Capacity must be an integer' })
  capacity: number;

  @IsInt({ message: 'Current fill level must be an integer' })
  currentFillLevel: number;

  @IsEnum(BinType, { message: 'Invalid bin type' })
  binType: BinType;

  @IsBoolean({ message: 'isDamaged must be a boolean' })
  isDamaged: boolean;

  @IsOptional()
  @IsMongoId({ message: 'Invalid collection ID' })
  collectionId?: string;
  @IsOptional()

  @IsMongoId({ message: 'Invalid route ID' })
  routeId: string;
}
