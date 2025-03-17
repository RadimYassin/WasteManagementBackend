import { IsString, IsEnum, IsNumber, IsOptional, IsMongoId, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export enum SensorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MALFUNCTIONING = 'MALFUNCTIONING',
}

export enum SensorType {
  FILL_LEVEL = 'FILL_LEVEL',
  TEMPERATURE = 'TEMPERATURE',
  WEIGHT = 'WEIGHT',
  OTHER = 'OTHER',
}

export class CreateSensorDto {
  @IsEnum(SensorType, { message: 'Invalid sensor type' })
  type: SensorType;

  @IsEnum(SensorStatus, { message: 'Invalid sensor status' })
  status: SensorStatus;

  @IsNumber({}, { message: 'Reading must be a number' })
  reading: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Invalid last maintenance date' })
  lastMaintenance?: Date;

  @IsMongoId({ message: 'Invalid bin ID' })
  binId: string;
}
