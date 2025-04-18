
import { SilverProductController } from './silver-product.controller';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SilverProductsService } from '../../services/Silver/product.service';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';
import { SilverProduct, SilverProductSchema } from '../../entities/Silver/silverProductMaster';
import { SilverGroup, SilverGroupSchema } from '../../entities/Silver/silverGroup.entity';
import { SilverUnit, SilverUnitSchema } from '../../entities/Silver/silverUnit.entity';
import { SilverBrand, SilverBrandSchema } from '../../entities/Silver/silverBrand.entity';
import { SilverCategory, SilverCategorySchema } from '../../entities/Silver/silverCategory.entity';
import { SilverSubcategory, SilverSubcategorySchema } from '../../entities/Silver/silverSubCategory';
import { RoOrder, RoOrderSchema } from '../../entities/Silver/roOrder';
import { RoInventory, RoInventorySchema } from '../../entities/Silver/roInventory';
import { RoConsumption, RoConsumptionSchema } from '../../entities/Silver/roConsumption';
import { CgOrder, CgOrderSchema } from '../../entities/Silver/cgOrder';
import { CgInventory, CgInventorySchema } from '../../entities/Silver/cgInventory';
import { CgConsumption, CgConsumptionSchema } from '../../entities/Silver/cgConsumption';
import { User, UserSchema } from '../../entities/users.entity';
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [ MongooseModule.forFeature([
    { name: SilverProduct.name, schema: SilverProductSchema },
    { name: SilverUnit.name, schema: SilverUnitSchema },
    { name: SilverGroup.name, schema: SilverGroupSchema },
    { name: SilverBrand.name, schema: SilverBrandSchema },
    { name: SilverSubcategory.name, schema: SilverSubcategorySchema },
    { name: SilverCategory.name, schema: SilverCategorySchema },
    { name: RoOrder.name, schema: RoOrderSchema },
    { name: RoInventory.name, schema: RoInventorySchema },
    { name: RoConsumption.name, schema: RoConsumptionSchema },
    { name: CgOrder.name, schema: CgOrderSchema },
    { name: User.name, schema: UserSchema },
    { name: CgConsumption.name, schema: CgConsumptionSchema },
    { name: CgInventory.name, schema: CgInventorySchema }])],
  controllers: [SilverProductController],
  providers: [SilverProductsService]
})
export class SilverProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes(SilverProductController)
  }
}


