import { Controller, Post, Body, UseGuards, Request, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':marketId')
  @Roles('market_owner')
  create(
    @Param('marketId', ParseIntPipe) marketId: number,
    @Request() req,
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.create(marketId, req.user, dto);
  }
}