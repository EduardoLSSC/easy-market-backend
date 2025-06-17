// src/products/products.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private async assertOwner(marketId: number, user: any) {
    const market = await this.prisma.market.findUnique({ where: { id: marketId } });
    if (!market) throw new NotFoundException('Market not found');
    if (user.role !== 'market_owner' || user.id !== market.ownerId) {
      throw new ForbiddenException('Access denied');
    }
    return market;
  }

  async create(marketId: number, user: any, dto: CreateProductDto) {
    await this.assertOwner(marketId, user);
    return this.prisma.product.create({
      data: { ...dto, marketId },
    });
  }

  async findAll(marketId: number, user: any) {
    await this.assertOwner(marketId, user);
    return this.prisma.product.findMany({ where: { marketId } });
  }

  async update(id: number, user: any, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.assertOwner(product.marketId, user);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: number, user: any) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.assertOwner(product.marketId, user);
    return this.prisma.product.delete({ where: { id } });
  }
}
