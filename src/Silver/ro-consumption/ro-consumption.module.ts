import { RoConsumptionController } from './ro-consumption.controller';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { RoConsumptionService } from '../../services/Silver/ro-consumption.service';
import { RoConsumption, RoConsumptionSchema } from '../../entities/Silver/roConsumption';
import { CgConsumption, CgConsumptionSchema } from '../../entities/Silver/cgConsumption';
import { RoMaster, RoMasterSchema } from '../../entities/Silver/roMaster';
import { RoOrder, RoOrderSchema } from '../../entities/Silver/roOrder';
import { CgOrder, CgOrderSchema } from '../../entities/Silver/cgOrder';
import { RoInventory, RoInventorySchema } from '../../entities/Silver/roInventory';
import { CgInventory, CgInventorySchema } from '../../entities/Silver/cgInventory';
import { User, UserSchema } from '../../entities/users.entity';
import { SilverProduct, SilverProductSchema } from '../../entities/Silver/silverProductMaster';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';


@Module({
  imports: [MongooseModule.forFeature([
    { name: RoInventory.name, schema: RoInventorySchema },
    { name: RoConsumption.name, schema: RoConsumptionSchema },
    { name: RoOrder.name, schema: RoOrderSchema },
    { name: CgInventory.name, schema: CgInventorySchema },
    { name: CgConsumption.name, schema: CgConsumptionSchema},
    { name: CgOrder.name, schema: CgOrderSchema },
    { name: RoMaster.name, schema: RoMasterSchema },
    { name: User.name, schema: UserSchema },
    { name: SilverProduct.name, schema: SilverProductSchema },
  ])],
  controllers: [RoConsumptionController],
  providers: [RoConsumptionService]
})
export class RoConsumptionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes(RoConsumptionController)
  }
}