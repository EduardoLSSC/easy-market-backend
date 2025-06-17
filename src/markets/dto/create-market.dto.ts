// src/markets/dto/create-market-with-owner.dto.ts
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateMarketWithOwnerDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() location: string;

  // dados do dono
  @IsEmail() @IsNotEmpty() ownerEmail: string;
  @IsString() @IsNotEmpty() ownerPassword: string;
}
