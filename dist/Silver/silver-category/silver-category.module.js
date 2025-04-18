"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilverCategoryModule = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("../../services/Silver/category.service");
const silver_category_controller_1 = require("./silver-category.controller");
const login_middleware_1 = require("../../common/middleware/login.middleware");
const silverCategory_entity_1 = require("../../entities/Silver/silverCategory.entity");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const roInventory_1 = require("../../entities/Silver/roInventory");
const cgInventory_1 = require("../../entities/Silver/cgInventory");
const silverSubCategory_1 = require("../../entities/Silver/silverSubCategory");
const cgOrder_1 = require("../../entities/Silver/cgOrder");
const roOrder_1 = require("../../entities/Silver/roOrder");
const roConsumption_1 = require("../../entities/Silver/roConsumption");
const cgConsumption_1 = require("../../entities/Silver/cgConsumption");
const mongoose_1 = require("@nestjs/mongoose");
let SilverCategoryModule = class SilverCategoryModule {
    configure(consumer) {
        consumer.apply(login_middleware_1.LoginMiddleware).forRoutes(silver_category_controller_1.SilverCategoryController);
    }
};
SilverCategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: silverCategory_entity_1.SilverCategory.name, schema: silverCategory_entity_1.SilverCategorySchema },
                { name: silverProductMaster_1.SilverProduct.name, schema: silverProductMaster_1.SilverProductSchema },
                { name: roInventory_1.RoInventory.name, schema: roInventory_1.RoInventorySchema },
                { name: cgInventory_1.CgInventory.name, schema: cgInventory_1.CgInventorySchema },
                { name: silverSubCategory_1.SilverSubcategory.name, schema: silverSubCategory_1.SilverSubcategorySchema },
                { name: cgOrder_1.CgOrder.name, schema: cgOrder_1.CgOrderSchema },
                { name: roOrder_1.RoOrder.name, schema: roOrder_1.RoOrderSchema },
                { name: roConsumption_1.RoConsumption.name, schema: roConsumption_1.RoConsumptionSchema },
                { name: cgConsumption_1.CgConsumption.name, schema: cgConsumption_1.CgConsumptionSchema },
            ])],
        controllers: [silver_category_controller_1.SilverCategoryController],
        providers: [category_service_1.SilverCategoryService]
    })
], SilverCategoryModule);
exports.SilverCategoryModule = SilverCategoryModule;
//# sourceMappingURL=silver-category.module.js.map