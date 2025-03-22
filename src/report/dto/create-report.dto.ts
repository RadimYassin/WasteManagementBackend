import { IsEnum, IsString, IsOptional, IsBoolean, IsDate, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

// Define IssueType Enum
export enum IssueType {
  DAMAGED_BIN = 'DAMAGED_BIN',
  OVERFLOWING_BIN = 'OVERFLOWING_BIN',
  MISSING_BIN = 'MISSING_BIN',
  SENSOR_FAILURE = 'SENSOR_FAILURE',
  OTHER = 'OTHER',
}

// Report DTO
export class CreateReportDto {

  @IsEnum(IssueType, { message: 'Invalid issue type' })
  issueType: IssueType;

  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string;

  @IsString({ message: 'Description is required' })
  description: string;
  @IsOptional()
  @IsMongoId({ message: 'Invalid admin ID' })
  assignedAdminId?: string;
  @IsOptional()

  @IsBoolean({ message: 'isResolved must be a boolean' })
  isResolved: boolean;
  @IsOptional()

  @Type(() => Date)
  @IsDate({ message: 'Invalid timestamp' })
  timestamp: Date;

  @IsMongoId({ message: 'Invalid bin ID' })
  binId: string;

  @IsMongoId({ message: 'Invalid user ID' })
  userId: string;
}
