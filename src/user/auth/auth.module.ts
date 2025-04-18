import { Module } from '@nestjs/common';
import {MongooseModule } from '@nestjs/mongoose'
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../../entities/users.entity';
import { RoMaster ,RoMasterSchema}from '../../entities/Silver/roMaster';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
  
    JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRED_TIME },
  }), MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: RoMaster.name, schema: RoMasterSchema },
  ])],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {
  
}
