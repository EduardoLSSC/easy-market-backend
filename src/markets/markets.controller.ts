// src/markets/markets.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateMarketWithOwnerDto } from './dto/create-market-with-owner.dto';
import { MarketsService } from './markets.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Post('with-owner')
  @Roles('admin')
  createWithOwner(@Body() dto: CreateMarketWithOwnerDto) {
    return this.marketsService.createWithOwner(dto);
  }
}
