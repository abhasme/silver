import { CgConsumptionController } from './cg-consumption.controller';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CgConsumptionService } from '../../services/Silver/cg-consumption.service';
import { MongooseModule } from '@nestjs/mongoose'
import { CgConsumption, CgConsumptionSchema } from '../../entities/Silver/cgConsumption';
import { RoConsumption, RoConsumptionSchema } from '../../entities/Silver/roConsumption';
import { RoMaster, RoMasterSchema } from '../../entities/Silver/roMaster';
import { CgOrder, CgOrderSchema } from '../../entities/Silver/cgOrder';
import { RoOrder, RoOrderSchema } from '../../entities/Silver/roOrder';
import { CgInventory, CgInventorySchema } from '../../entities/Silver/cgInventory';
import { RoInventory, RoInventorySchema } from '../../entities/Silver/roInventory';
import { User, UserSchema } from '../../entities/users.entity';
import { SilverProduct, SilverProductSchema } from '../../entities/Silver/silverProductMaster';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';


@Module({
  imports: [MongooseModule.forFeature([
    { name: CgOrder.name, schema: CgOrderSchema },
    { name: CgInventory.name, schema: CgInventorySchema },
    { name: CgConsumption.name, schema: CgConsumptionSchema },
    { name: RoInventory.name, schema: RoInventorySchema },
    { name: RoOrder.name, schema: RoOrderSchema },
    { name: RoConsumption.name, schema: RoConsumptionSchema },
    { name: RoMaster.name, schema: RoMasterSchema },
    { name: User.name, schema: UserSchema },
    { name: SilverProduct.name, schema: SilverProductSchema },
  ])],
  controllers: [CgConsumptionController],
  providers: [CgConsumptionService]
})
export class CgConsumptionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes(CgConsumptionService)
  }
}