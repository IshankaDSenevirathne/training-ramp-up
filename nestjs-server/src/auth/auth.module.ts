import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User, Session } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AuthController],
  providers: [{ provide: 'AUTH_SERVICE', useClass: AuthService }, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Session]),
  ],
})
export class AuthModule {}
