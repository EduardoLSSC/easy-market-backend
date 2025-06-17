import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(marketId: number, creator: any, dto: CreateUserDto) {
    // Apenas market_owner pode criar usuários para seu mercado
    if (creator.role !== 'market_owner') {
      throw new ForbiddenException('Access denied');
    }
    // Opcional: checar se creator realmente dono do marketId
    // Opcional: checar se creator realmente dono do marketId
    const market = await this.prisma.market.findUnique({ where: { id: marketId } });
    // pega o ID do usuário corretamente, seja ele no payload JWT (sub) ou no objeto User (id)
    const userId = (creator.sub as number) ?? (creator.id as number);
    if (!market || market.ownerId !== userId) {
      throw new ForbiddenException('Access denied to this market');
    }


    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        role: dto.role, // sempre será 'market_owner' para novos donos ou 'user'
      },
    });
    // Se quiser relacionar user ao mercado, deveria ajustar schema e usar connect
    return user;
  }
}