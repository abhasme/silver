import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CgOrderController } from './cg-order.controller';
import { CgOrderService } from 'src/services/Silver/cg-order.service';
import { MongooseModule } from '@nestjs/mongoose'
import { CgOrder, CgOrderSchema } from '../../entities/Silver/cgOrder';
import { RoOrder, RoOrderSchema } from '../../entities/Silver/roOrder';
import { CgInventory, CgInventorySchema } from '../../entities/Silver/cgInventory';
import { RoInventory, RoInventorySchema } from '../../entities/Silver/roInventory';
import { SilverProduct, SilverProductSchema } from '../../entities/Silver/silverProductMaster';
import { RoMaster,RoMasterSchema} from '../../entities/Silver/roMaster';
import { CgConsumption, CgConsumptionSchema } from '../../entities/Silver/cgConsumption';
import { RoConsumption, RoConsumptionSchema } from '../../entities/Silver/roConsumption';
import { User, UserSchema } from '../../entities/users.entity';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';

@Module({
  imports: [MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    { name: RoOrder.name, schema: RoOrderSchema },
    { name: CgOrder.name, schema: CgOrderSchema },
    { name: RoMaster.name, schema: RoMasterSchema },
    { name: CgInventory.name, schema: CgInventorySchema },
    { name: RoInventory.name, schema: RoInventorySchema },
    { name: CgConsumption.name, schema: CgConsumptionSchema },
    { name: RoConsumption.name, schema: RoConsumptionSchema },
    { name: SilverProduct.name, schema: SilverProductSchema }
])
],
  controllers: [CgOrderController],
  providers: [CgOrderService]
})
export class CgOrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes(CgOrderController)
  }
}