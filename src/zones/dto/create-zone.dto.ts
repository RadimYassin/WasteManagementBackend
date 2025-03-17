import { IsBoolean, IsInt, IsNotEmpty, IsString, IsMongoId, IsNumber } from 'class-validator';

export class CreateZoneDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'value must be a valid float' })
  currentLat   :  number;
  @IsNotEmpty()
  @IsNumber({}, { message: 'value must be a valid float' })
  currentLng   :  number;
  @IsNotEmpty()
  @IsMongoId()
  assignedAdminId: string;
  @IsInt()
  totalBins: number;
  @IsBoolean()
  isActive: boolean;
}
