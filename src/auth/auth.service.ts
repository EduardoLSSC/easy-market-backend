import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    const userWithMarkets = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { markets: true },
    });
    const firstMarket = userWithMarkets?.markets?.[0];

    return {
      access_token,
      user: {
        id: userWithMarkets?.id,
        email: userWithMarkets?.email,
        role: userWithMarkets?.role,
        market: firstMarket
          ? { id: firstMarket.id, name: firstMarket.name }
          : null,
      },
    };
  }

  async register(data: { email: string; password: string; role: Role }) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(data.password, saltRounds);
    const user = await this.prisma.user.create({
      data: { email: data.email, password: hashed, role: data.role },
    });
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid email or password');
    return user;
  }
}