"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CgInventoryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cg_inventory_service_1 = require("../../services/Silver/cg-inventory.service");
const cg_inventory_controller_1 = require("./cg-inventory.controller");
const cgInventory_1 = require("../../entities/Silver/cgInventory");
const roInventory_1 = require("../../entities/Silver/roInventory");
const login_middleware_1 = require("../../common/middleware/login.middleware");
const cgConsumption_1 = require("../../entities/Silver/cgConsumption");
const roConsumption_1 = require("../../entities/Silver/roConsumption");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const roMaster_1 = require("../../entities/Silver/roMaster");
const cgOrder_1 = require("../../entities/Silver/cgOrder");
const roOrder_1 = require("../../entities/Silver/roOrder");
const users_entity_1 = require("../../entities/users.entity");
const cggrowthFactorInfo_1 = require("../../entities/Silver/cggrowthFactorInfo");
let CgInventoryModule = class CgInventoryModule {
    configure(consumer) {
        consumer.apply(login_middleware_1.LoginMiddleware).forRoutes(cg_inventory_controller_1.CgInventoryController);
    }
};
CgInventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: roInventory_1.RoInventory.name, schema: roInventory_1.RoInventorySchema },
                { name: cgInventory_1.CgInventory.name, schema: cgInventory_1.CgInventorySchema },
                { name: cgConsumption_1.CgConsumption.name, schema: cgConsumption_1.CgConsumptionSchema },
                { name: roConsumption_1.RoConsumption.name, schema: roConsumption_1.RoConsumptionSchema },
                { name: roOrder_1.RoOrder.name, schema: roOrder_1.RoOrderSchema },
                { name: cgOrder_1.CgOrder.name, schema: cgOrder_1.CgOrderSchema },
                { name: users_entity_1.User.name, schema: users_entity_1.UserSchema },
                { name: roMaster_1.RoMaster.name, schema: roMaster_1.RoMasterSchema },
                { name: silverProductMaster_1.SilverProduct.name, schema: silverProductMaster_1.SilverProductSchema },
                { name: cggrowthFactorInfo_1.CgGrowthFactor.name, schema: cggrowthFactorInfo_1.CgGrowthFactorSchema },
            ])],
        controllers: [cg_inventory_controller_1.CgInventoryController],
        providers: [cg_inventory_service_1.CgInventoryService]
    })
], CgInventoryModule);
exports.CgInventoryModule = CgInventoryModule;
//# sourceMappingURL=cg-inventory.module.js.map