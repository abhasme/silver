import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { CgInventoryService } from '../../services/Silver/cg-inventory.service';
import { CgInventoryController } from './cg-inventory.controller';
import { CgInventory, CgInventorySchema } from '../../entities/Silver/cgInventory';
import { RoInventory, RoInventorySchema } from '../../entities/Silver/roInventory';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';
import { CgConsumption, CgConsumptionSchema } from '../../entities/Silver/cgConsumption';
import { RoConsumption, RoConsumptionSchema } from '../../entities/Silver/roConsumption';
import { SilverProduct, SilverProductSchema } from '../../entities/Silver/silverProductMaster';
import { RoMaster, RoMasterSchema } from '../../entities/Silver/roMaster';
import { CgOrder, CgOrderSchema } from '../../entities/Silver/cgOrder';
import { RoOrder, RoOrderSchema } from '../../entities/Silver/roOrder';
import { User, UserSchema } from '../../entities/users.entity';
import { CgGrowthFactor, CgGrowthFactorSchema } from '../../entities/Silver/cggrowthFactorInfo';

@Module({
  imports: [MongooseModule.forFeature([
    { name: RoInventory.name, schema: RoInventorySchema },
    { name: CgInventory.name, schema: CgInventorySchema },
    { name: CgConsumption.name, schema: CgConsumptionSchema },
    { name: RoConsumption.name, schema: RoConsumptionSchema },
    { name: RoOrder.name, schema: RoOrderSchema },
    { name: CgOrder.name, schema: CgOrderSchema },
    { name: User.name, schema: UserSchema },
    { name: RoMaster.name, schema: RoMasterSchema },
    { name: SilverProduct.name, schema: SilverProductSchema },
    { name: CgGrowthFactor.name, schema: CgGrowthFactorSchema },
  ])],
  controllers: [CgInventoryController],
  providers: [CgInventoryService]
})
export class CgInventoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes(CgInventoryController)
  }
}