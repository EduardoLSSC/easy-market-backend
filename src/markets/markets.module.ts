import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MarketsController],
  providers: [MarketsService, PrismaService],
})
export class MarketsModule {}
