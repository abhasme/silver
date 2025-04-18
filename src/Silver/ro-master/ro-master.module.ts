import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RoMasterController } from '../ro-master/ro-master.controller';
import { MongooseModule } from '@nestjs/mongoose'
import { RoMasterService } from '../../services/Silver/ro-master.service';
import { RoMaster, RoMasterSchema } from '../../entities/Silver/roMaster';
import { RoOrder, RoOrderSchema } from '../../entities/Silver/roOrder';
import { CgOrder, CgOrderSchema } from '../../entities/Silver/cgOrder';
import { CgInventory, CgInventorySchema } from '../../entities/Silver/cgInventory';
import { RoInventory, RoInventorySchema } from '../../entities/Silver/roInventory';
import { RoConsumption, RoConsumptionSchema } from '../../entities/Silver/roConsumption';
import { CgConsumption, CgConsumptionSchema } from '../../entities/Silver/cgConsumption';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';

@Module({
  imports: [MongooseModule.forFeature([
    { name: RoMaster.name, schema: RoMasterSchema },
    { name: RoOrder.name, schema: RoOrderSchema },
    { name: CgOrder.name, schema: CgOrderSchema },
    { name: CgInventory.name, schema: CgInventorySchema },
    { name: RoInventory.name, schema: RoInventorySchema },
    { name: RoConsumption.name, schema: RoConsumptionSchema },
    { name: CgConsumption.name, schema: CgConsumptionSchema },
  ])],
  controllers: [RoMasterController],
  providers: [RoMasterService]
})
export class RoMasterModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {consumer.apply(LoginMiddleware).forRoutes(RoMasterController)}
}
