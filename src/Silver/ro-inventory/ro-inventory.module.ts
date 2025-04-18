import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { RoInventoryService } from '../../services/Silver/ro-inventory.service';
import { RoInventoryController } from './ro-inventory.controller';
import { RoInventory, RoInventorySchema } from '../../entities/Silver/roInventory';
import { CgInventory, CgInventorySchema } from '../../entities/Silver/cgInventory';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';
import { RoConsumption, RoConsumptionSchema } from '../../entities/Silver/roConsumption';
import { CgConsumption, CgConsumptionSchema } from '../../entities/Silver/cgConsumption';
import { SilverProduct, SilverProductSchema } from '../../entities/Silver/silverProductMaster';
import { RoMaster, RoMasterSchema } from '../../entities/Silver/roMaster';
import { RoOrder, RoOrderSchema } from '../../entities/Silver/roOrder';
import { CgOrder, CgOrderSchema } from '../../entities/Silver/cgOrder';
import { User, UserSchema } from '../../entities/users.entity';
import { CgGrowthFactor, CgGrowthFactorSchema } from '../../entities/Silver/cggrowthFactorInfo';

@Module({
  imports: [MongooseModule.forFeature([
    { name: CgConsumption.name, schema: CgConsumptionSchema },
    { name: RoConsumption.name, schema: RoConsumptionSchema },
    { name: RoInventory.name, schema: RoInventorySchema },
    { name: CgInventory.name, schema: CgInventorySchema },
    { name: RoMaster.name, schema: RoMasterSchema },
    { name: SilverProduct.name, schema: SilverProductSchema },
    { name: RoOrder.name, schema: RoOrderSchema },
    { name: CgOrder.name, schema: CgOrderSchema },
    { name: User.name, schema: UserSchema },
    { name: CgGrowthFactor.name, schema: CgGrowthFactorSchema },
  ])],
  controllers: [RoInventoryController],
  providers: [RoInventoryService]
})
export class RoInventoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes(RoInventoryController)
  }
}