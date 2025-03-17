import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
 @IsEnum(Role, { message: 'Invalid role' })
 role: Role;

  @IsOptional()
  address?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  licenseNumber?: string;
}
