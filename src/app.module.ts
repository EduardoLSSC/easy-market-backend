import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { MarketsModule } from './markets/markets.module';

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    UsersModule,
    MarketsModule,
  ],
})
export class AppModule {}
