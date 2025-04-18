"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const serve_static_module_1 = require("@nestjs/serve-static/dist/serve-static.module");
const path_1 = require("path");
const config_1 = require("@nestjs/config");
const cron_service_1 = require("./cron/cron.service");
const schedule_1 = require("@nestjs/schedule");
const helper_service_1 = require("./common/utils/helper.service");
const silverCategory_entity_1 = require("./entities/Silver/silverCategory.entity");
const silverSubCategory_1 = require("./entities/Silver/silverSubCategory");
const silverProductMaster_1 = require("./entities/Silver/silverProductMaster");
const roMaster_1 = require("./entities/Silver/roMaster");
const roInventory_1 = require("./entities/Silver/roInventory");
const cgInventory_1 = require("./entities/Silver/cgInventory");
const roConsumption_1 = require("./entities/Silver/roConsumption");
const cgConsumption_1 = require("./entities/Silver/cgConsumption");
const cgOrder_1 = require("./entities/Silver/cgOrder");
const roOrder_1 = require("./entities/Silver/roOrder");
const silverGroup_entity_1 = require("./entities/Silver/silverGroup.entity");
const silverBrand_entity_1 = require("./entities/Silver/silverBrand.entity");
const silverUnit_entity_1 = require("./entities/Silver/silverUnit.entity");
const cggrowthFactorInfo_1 = require("./entities/Silver/cggrowthFactorInfo");
const dotenv = require("dotenv");
dotenv.config();
console.log(process.env.DB_URL, 5654656);
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(`${process.env.DB_URL}`),
            user_module_1.UserModule,
            config_1.ConfigModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            serve_static_module_1.ServeStaticModule.forRoot({ rootPath: (0, path_1.join)(__dirname, '..', 'silver-grey-metre', 'uploaded') }),
            mongoose_1.MongooseModule.forFeature([
                { name: roMaster_1.RoMaster.name, schema: roMaster_1.RoMasterSchema },
                { name: silverCategory_entity_1.SilverCategory.name, schema: silverCategory_entity_1.SilverCategorySchema },
                { name: silverSubCategory_1.SilverSubcategory.name, schema: silverSubCategory_1.SilverSubcategorySchema },
                { name: silverProductMaster_1.SilverProduct.name, schema: silverProductMaster_1.SilverProductSchema },
                { name: roConsumption_1.RoConsumption.name, schema: roConsumption_1.RoConsumptionSchema },
                { name: cgConsumption_1.CgConsumption.name, schema: cgConsumption_1.CgConsumptionSchema },
                { name: roInventory_1.RoInventory.name, schema: roInventory_1.RoInventorySchema },
                { name: cgInventory_1.CgInventory.name, schema: cgInventory_1.CgInventorySchema },
                { name: cgOrder_1.CgOrder.name, schema: cgOrder_1.CgOrderSchema },
                { name: roOrder_1.RoOrder.name, schema: roOrder_1.RoOrderSchema },
                { name: silverGroup_entity_1.SilverGroup.name, schema: silverGroup_entity_1.SilverGroupSchema },
                { name: silverBrand_entity_1.SilverBrand.name, schema: silverBrand_entity_1.SilverBrandSchema },
                { name: silverUnit_entity_1.SilverUnit.name, schema: silverUnit_entity_1.SilverUnitSchema },
                { name: cggrowthFactorInfo_1.CgGrowthFactor.name, schema: cggrowthFactorInfo_1.CgGrowthFactorSchema },
            ]),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, cron_service_1.CronService, helper_service_1.CronHelper],
    })
], AppModule);
exports.AppModule = AppModule;
;
//# sourceMappingURL=app.module.js.map