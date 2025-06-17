// src/products/dto/create-product.dto.ts
import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty()    name: string;
  @IsString() @IsNotEmpty()    barcode: string;
  @IsNumber() @Min(0)          price: number;
  @IsNumber() @Min(0)          weightKg: number;
  @IsNumber() @Min(0)          quantity: number;
}
