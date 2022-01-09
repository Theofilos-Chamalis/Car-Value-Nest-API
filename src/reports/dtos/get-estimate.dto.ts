import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear())
  year: number;

  /** Convert from string (inside a Query String) to a number **/
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  mileage: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;
}
