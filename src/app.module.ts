import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config'
import { CronService } from './cron/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronHelper } from './common/utils/helper.service';

// Silver
import { SilverCategory, SilverCategorySchema} from './entities/Silver/silverCategory.entity';
import { SilverSubcategory, SilverSubcategorySchema} from './entities/Silver/silverSubCategory';
import { SilverProduct, SilverProductSchema} from './entities/Silver/silverProductMaster';
import { RoMaster, RoMasterSchema} from './entities/Silver/roMaster';
import { RoInventory, RoInventorySchema} from './entities/Silver/roInventory';
import { CgInventory, CgInventorySchema} from './entities/Silver/cgInventory';
import { RoConsumption, RoConsumptionSchema} from './entities/Silver/roConsumption';
import { CgConsumption, CgConsumptionSchema} from './entities/Silver/cgConsumption';
import { CgOrder, CgOrderSchema} from './entities/Silver/cgOrder';
import { RoOrder, RoOrderSchema} from './entities/Silver/roOrder';
import { SilverGroup, SilverGroupSchema} from './entities/Silver/silverGroup.entity';
import { SilverBrand, SilverBrandSchema} from './entities/Silver/silverBrand.entity';
import { SilverUnit, SilverUnitSchema} from './entities/Silver/silverUnit.entity';
import { CgGrowthFactor, CgGrowthFactorSchema} from './entities/Silver/cggrowthFactorInfo';

import * as dotenv from 'dotenv';

dotenv.config();

console.log(process.env.DB_URL,5654656)
@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true}),
    // testing server 
    MongooseModule.forRoot(`${process.env.DB_URL}`),
    // MongooseModule.forRoot(`mongodb://98.81.80.93::27017/silver_db`),
    // live server 

    
    UserModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({rootPath: join(__dirname, '..','silver-grey-metre', 'uploaded')}),
    MongooseModule.forFeature([
      { name: RoMaster.name, schema: RoMasterSchema },
      { name: SilverCategory.name, schema: SilverCategorySchema },
      { name: SilverSubcategory.name, schema: SilverSubcategorySchema },
      { name: SilverProduct.name, schema: SilverProductSchema },
      { name: RoConsumption.name, schema: RoConsumptionSchema},
      { name: CgConsumption.name, schema: CgConsumptionSchema},
      { name: RoInventory.name, schema: RoInventorySchema},
      { name: CgInventory.name, schema: CgInventorySchema},
      { name: CgOrder.name, schema: CgOrderSchema},
      { name: RoOrder.name, schema: RoOrderSchema},
      { name: SilverGroup.name, schema: SilverGroupSchema},
      { name: SilverBrand.name, schema: SilverBrandSchema},
      { name: SilverUnit.name, schema: SilverUnitSchema},
      { name: CgGrowthFactor.name, schema: CgGrowthFactorSchema},
    ]),
  ],
  controllers: [AppController],
  providers: [AppService,CronService,CronHelper],
})
export class AppModule {};


