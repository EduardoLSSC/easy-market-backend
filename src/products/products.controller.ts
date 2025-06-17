// src/products/products.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Get,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(':marketId')
  @Roles('market_owner')
  create(
    @Param('marketId', ParseIntPipe) marketId: number,
    @Request() req,
    @Body() dto: CreateProductDto,
  ) {
    console.log(dto)
    return this.productsService.create(marketId, req.user, dto);
  }

  @Get(':marketId')
  @Roles('market_owner')
  findAll(
    @Param('marketId', ParseIntPipe) marketId: number,
    @Request() req,
  ) {
    return this.productsService.findAll(marketId, req.user);
  }

  @Put(':id')
  @Roles('market_owner')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, req.user, dto);
  }

  @Delete(':id')
  @Roles('market_owner')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.productsService.remove(id, req.user);
  }
}
