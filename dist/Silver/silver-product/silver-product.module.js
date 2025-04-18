"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilverProductModule = void 0;
const silver_product_controller_1 = require("./silver-product.controller");
const common_1 = require("@nestjs/common");
const product_service_1 = require("../../services/Silver/product.service");
const login_middleware_1 = require("../../common/middleware/login.middleware");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const silverGroup_entity_1 = require("../../entities/Silver/silverGroup.entity");
const silverUnit_entity_1 = require("../../entities/Silver/silverUnit.entity");
const silverBrand_entity_1 = require("../../entities/Silver/silverBrand.entity");
const silverCategory_entity_1 = require("../../entities/Silver/silverCategory.entity");
const silverSubCategory_1 = require("../../entities/Silver/silverSubCategory");
const roOrder_1 = require("../../entities/Silver/roOrder");
const roInventory_1 = require("../../entities/Silver/roInventory");
const roConsumption_1 = require("../../entities/Silver/roConsumption");
const cgOrder_1 = require("../../entities/Silver/cgOrder");
const cgInventory_1 = require("../../entities/Silver/cgInventory");
const cgConsumption_1 = require("../../entities/Silver/cgConsumption");
const users_entity_1 = require("../../entities/users.entity");
const mongoose_1 = require("@nestjs/mongoose");
let SilverProductModule = class SilverProductModule {
    configure(consumer) {
        consumer.apply(login_middleware_1.LoginMiddleware).forRoutes(silver_product_controller_1.SilverProductController);
    }
};
SilverProductModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: silverProductMaster_1.SilverProduct.name, schema: silverProductMaster_1.SilverProductSchema },
                { name: silverUnit_entity_1.SilverUnit.name, schema: silverUnit_entity_1.SilverUnitSchema },
                { name: silverGroup_entity_1.SilverGroup.name, schema: silverGroup_entity_1.SilverGroupSchema },
                { name: silverBrand_entity_1.SilverBrand.name, schema: silverBrand_entity_1.SilverBrandSchema },
                { name: silverSubCategory_1.SilverSubcategory.name, schema: silverSubCategory_1.SilverSubcategorySchema },
                { name: silverCategory_entity_1.SilverCategory.name, schema: silverCategory_entity_1.SilverCategorySchema },
                { name: roOrder_1.RoOrder.name, schema: roOrder_1.RoOrderSchema },
                { name: roInventory_1.RoInventory.name, schema: roInventory_1.RoInventorySchema },
                { name: roConsumption_1.RoConsumption.name, schema: roConsumption_1.RoConsumptionSchema },
                { name: cgOrder_1.CgOrder.name, schema: cgOrder_1.CgOrderSchema },
                { name: users_entity_1.User.name, schema: users_entity_1.UserSchema },
                { name: cgConsumption_1.CgConsumption.name, schema: cgConsumption_1.CgConsumptionSchema },
                { name: cgInventory_1.CgInventory.name, schema: cgInventory_1.CgInventorySchema }
            ])],
        controllers: [silver_product_controller_1.SilverProductController],
        providers: [product_service_1.SilverProductsService]
    })
], SilverProductModule);
exports.SilverProductModule = SilverProductModule;
//# sourceMappingURL=silver-product.module.js.map