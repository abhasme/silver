import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
//Silver
import { SilverCategoryModule } from 'src/Silver/silver-category/silver-category.module';
import { SilverSubCategoryModule } from 'src/Silver/silver-sub-category/silver-sub-category.module';
import { SilverProductModule } from 'src/Silver/silver-product/silver-product.module';
import { RoMasterModule } from 'src/Silver/ro-master/ro-master.module';
import { RoConsumptionModule } from 'src/Silver/ro-consumption/ro-consumption.module';
import { RoInventoryModule } from 'src/Silver/ro-inventory/ro-inventory.module';
import { CgConsumptionModule } from 'src/Silver/cg-consumption/cg-consumption.module';
import { CgInventoryModule } from 'src/Silver/cg-inventory/cg-inventory.module';
import { CgOrderModule } from 'src/Silver/cg-order/cg-order.module';
import { RoOrderModule } from 'src/Silver/ro-order/ro-order.module';
import { GroupModule } from 'src/Silver/group/group.module';
import { BrandModule } from 'src/Silver/brand/brand.module';
import { SilverUnitModule } from 'src/Silver/unit/unit.module';
@Module({
  imports: [
    AuthModule,
    RoMasterModule,
    SilverProductModule,
    SilverCategoryModule,
    SilverSubCategoryModule,
    RoConsumptionModule,
    RoInventoryModule,
    RoInventoryModule,
    CgConsumptionModule,
    CgInventoryModule,
    CgOrderModule,
    RoOrderModule,
    SilverUnitModule,
    BrandModule,
    GroupModule
  ],
  controllers: [],
  providers: [],
})
export class UserModule {};
