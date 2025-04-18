import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SilverCategoryService } from '../../services/Silver/category.service';
import { SilverCategoryController } from './silver-category.controller';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';
import { SilverCategory, SilverCategorySchema } from '../../entities/Silver/silverCategory.entity';
import { SilverProduct, SilverProductSchema } from '../../entities/Silver/silverProductMaster';
import { RoInventory, RoInventorySchema } from '../../entities/Silver/roInventory';
import { CgInventory, CgInventorySchema } from '../../entities/Silver/cgInventory';
import { SilverSubcategory, SilverSubcategorySchema } from '../../entities/Silver/silverSubCategory';
import { CgOrder, CgOrderSchema } from '../../entities/Silver/cgOrder';
import { RoOrder, RoOrderSchema } from '../../entities/Silver/roOrder';
import { RoConsumption, RoConsumptionSchema } from '../../entities/Silver/roConsumption';
import { CgConsumption, CgConsumptionSchema } from '../../entities/Silver/cgConsumption';
import { MongooseModule } from '@nestjs/mongoose'

@Module({
    imports: [ MongooseModule.forFeature([
      { name: SilverCategory.name, schema: SilverCategorySchema },
      { name: SilverProduct.name, schema: SilverProductSchema},
      { name: RoInventory.name, schema: RoInventorySchema},
      { name: CgInventory.name, schema: CgInventorySchema},
      { name: SilverSubcategory.name, schema: SilverSubcategorySchema},
      { name: CgOrder.name, schema: CgOrderSchema},
      { name: RoOrder.name, schema: RoOrderSchema},
      { name: RoConsumption.name, schema: RoConsumptionSchema},
      { name: CgConsumption.name, schema: CgConsumptionSchema},
    ])],
    controllers: [SilverCategoryController],
    providers: [SilverCategoryService]
  })
export class SilverCategoryModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoginMiddleware).forRoutes(SilverCategoryController)
      }
}



