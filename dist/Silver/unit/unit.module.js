"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilverUnitModule = void 0;
const common_1 = require("@nestjs/common");
const unit_controller_1 = require("./unit.controller");
const mongoose_1 = require("@nestjs/mongoose");
const unit_service_1 = require("../../services/Silver/unit.service");
const silverUnit_entity_1 = require("../../entities/Silver/silverUnit.entity");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const users_entity_1 = require("../../entities/users.entity");
const login_middleware_1 = require("../../common/middleware/login.middleware");
let SilverUnitModule = class SilverUnitModule {
    configure(consumer) {
        consumer.apply(login_middleware_1.LoginMiddleware).forRoutes(unit_controller_1.UnitController);
    }
};
SilverUnitModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: silverUnit_entity_1.SilverUnit.name, schema: silverUnit_entity_1.SilverUnitSchema },
                { name: silverProductMaster_1.SilverProduct.name, schema: silverProductMaster_1.SilverProductSchema },
                { name: users_entity_1.User.name, schema: users_entity_1.UserSchema },
            ])],
        controllers: [unit_controller_1.UnitController],
        providers: [unit_service_1.UnitService]
    })
], SilverUnitModule);
exports.SilverUnitModule = SilverUnitModule;
//# sourceMappingURL=unit.module.js.map