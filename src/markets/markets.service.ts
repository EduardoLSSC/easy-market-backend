import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarketWithOwnerDto } from './dto/create-market-with-owner.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MarketsService {
  constructor(private prisma: PrismaService) {}

  async createWithOwner(dto: CreateMarketWithOwnerDto) {
    // verifica se o e-mail do dono já existe
    const existing = await this.prisma.user.findUnique({ where: { email: dto.ownerEmail } });
    if (existing) {
      throw new ConflictException('Email do dono já está em uso');
    }

    // gera salt e hash da senha
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(dto.ownerPassword, salt);

    // cria usuário e mercado numa transação
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.ownerEmail,
          password: hashedPassword,
          role: 'market_owner',
        },
      });
      const market = await tx.market.create({
        data: {
          name: dto.name,
          location: dto.location,
          ownerId: user.id,
        },
      });
      return { user, market };
    });

    return result;
  }
}