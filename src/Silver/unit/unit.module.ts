import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UnitController } from './unit.controller';
import { MongooseModule } from '@nestjs/mongoose'
import { UnitService } from '../../services/Silver/unit.service';
import { SilverUnit, SilverUnitSchema } from '../../entities/Silver/silverUnit.entity';
import { SilverProduct, SilverProductSchema } from '../../entities/Silver/silverProductMaster';
import { User, UserSchema } from '../../entities/users.entity';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';


@Module({
  imports: [MongooseModule.forFeature([
    { name: SilverUnit.name, schema: SilverUnitSchema },
    { name: SilverProduct.name, schema: SilverProductSchema },
    { name: User.name, schema: UserSchema },
  ])],
  controllers: [UnitController],
  providers: [UnitService]
})
export class SilverUnitModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes(UnitController)
  }
}