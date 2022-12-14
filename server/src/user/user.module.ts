import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [UserController],
  providers: [{ provide: 'USER_SERVICE', useClass: UserService }],
})
export class UserModule {}
