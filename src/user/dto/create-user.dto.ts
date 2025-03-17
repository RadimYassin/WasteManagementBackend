import { 
  IsString, 
  IsEmail, 
  IsEnum, 
  IsBoolean, 
  IsOptional, 
  IsMongoId, 
  IsArray, 
  IsDate 
} from 'class-validator';
import { Type } from 'class-transformer';

// Define User Role Enum
export enum Role {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  NORMAL_USER = 'NORMAL_USER',
}

// Create DTO for User
export class CreateUserDto {
  @IsString({ message: 'Username must be a string' })
  username: string;

  @IsString({ message: 'Password must be a string' })
  password: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsEnum(Role, { message: 'Invalid role' })
  role: Role;

  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;

  @Type(() => Date)
  @IsDate({ message: 'Invalid creation date' })
  @IsOptional()
  createdAt?: Date;

  // Normal User Fields
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string;

  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  phoneNumber?: string;

  @IsBoolean({ message: 'hasPendingReports must be a boolean' })
  @IsOptional()
  hasPendingReports?: boolean;

  // Driver Fields
  @IsString({ message: 'License number must be a string' })
  @IsOptional()
  licenseNumber?: string;

  @IsBoolean({ message: 'isAvailable must be a boolean' })
  @IsOptional()
  isAvailable?: boolean;

  // Managed Bins
  @IsArray({ message: 'managedBins must be an array' })
  @IsMongoId({ each: true, message: 'Invalid bin ID in the list' })
  @IsOptional()
  managedBins?: string[];
}
