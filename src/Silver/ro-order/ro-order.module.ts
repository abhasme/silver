import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RoOrderController } from './ro-order.controller';
import { RoOrderService } from '../../services/Silver/ro-order.service';
import { MongooseModule } from '@nestjs/mongoose'
import { RoOrder, RoOrderSchema } from '../../entities/Silver/roOrder';
import { CgOrder, CgOrderSchema } from '../../entities/Silver/cgOrder';
import { RoInventory, RoInventorySchema } from '../../entities/Silver/roInventory';
import { CgInventory, CgInventorySchema } from '../../entities/Silver/cgInventory';
import { SilverProduct, SilverProductSchema } from '../../entities/Silver/silverProductMaster';
import { RoMaster,RoMasterSchema} from '../../entities/Silver/roMaster';
import { RoConsumption, RoConsumptionSchema } from '../../entities/Silver/roConsumption';
import { CgConsumption, CgConsumptionSchema } from '../../entities/Silver/cgConsumption';
import { User, UserSchema } from '../../entities/users.entity';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';

@Module({
  imports: [MongooseModule.forFeature([
    { name: RoOrder.name, schema: RoOrderSchema },
    { name: RoInventory.name, schema: RoInventorySchema },
    { name: RoMaster.name, schema: RoMasterSchema },
    { name: CgOrder.name, schema: CgOrderSchema },
    { name: CgInventory.name, schema: CgInventorySchema },
    { name: CgConsumption.name, schema: CgConsumptionSchema },
    { name: RoConsumption.name, schema: RoConsumptionSchema },
    { name: User.name, schema: UserSchema },
    { name: SilverProduct.name, schema: SilverProductSchema }
])
],
  controllers: [RoOrderController],
  providers: [RoOrderService]
})
export class RoOrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes(RoOrderController)
  }
}