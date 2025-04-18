"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoOrderModule = void 0;
const common_1 = require("@nestjs/common");
const ro_order_controller_1 = require("./ro-order.controller");
const ro_order_service_1 = require("../../services/Silver/ro-order.service");
const mongoose_1 = require("@nestjs/mongoose");
const roOrder_1 = require("../../entities/Silver/roOrder");
const cgOrder_1 = require("../../entities/Silver/cgOrder");
const roInventory_1 = require("../../entities/Silver/roInventory");
const cgInventory_1 = require("../../entities/Silver/cgInventory");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const roMaster_1 = require("../../entities/Silver/roMaster");
const roConsumption_1 = require("../../entities/Silver/roConsumption");
const cgConsumption_1 = require("../../entities/Silver/cgConsumption");
const users_entity_1 = require("../../entities/users.entity");
const login_middleware_1 = require("../../common/middleware/login.middleware");
let RoOrderModule = class RoOrderModule {
    configure(consumer) {
        consumer.apply(login_middleware_1.LoginMiddleware).forRoutes(ro_order_controller_1.RoOrderController);
    }
};
RoOrderModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: roOrder_1.RoOrder.name, schema: roOrder_1.RoOrderSchema },
                { name: roInventory_1.RoInventory.name, schema: roInventory_1.RoInventorySchema },
                { name: roMaster_1.RoMaster.name, schema: roMaster_1.RoMasterSchema },
                { name: cgOrder_1.CgOrder.name, schema: cgOrder_1.CgOrderSchema },
                { name: cgInventory_1.CgInventory.name, schema: cgInventory_1.CgInventorySchema },
                { name: cgConsumption_1.CgConsumption.name, schema: cgConsumption_1.CgConsumptionSchema },
                { name: roConsumption_1.RoConsumption.name, schema: roConsumption_1.RoConsumptionSchema },
                { name: users_entity_1.User.name, schema: users_entity_1.UserSchema },
                { name: silverProductMaster_1.SilverProduct.name, schema: silverProductMaster_1.SilverProductSchema }
            ])
        ],
        controllers: [ro_order_controller_1.RoOrderController],
        providers: [ro_order_service_1.RoOrderService]
    })
], RoOrderModule);
exports.RoOrderModule = RoOrderModule;
//# sourceMappingURL=ro-order.module.js.map