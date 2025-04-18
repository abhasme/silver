"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const silver_category_module_1 = require("../Silver/silver-category/silver-category.module");
const silver_sub_category_module_1 = require("../Silver/silver-sub-category/silver-sub-category.module");
const silver_product_module_1 = require("../Silver/silver-product/silver-product.module");
const ro_master_module_1 = require("../Silver/ro-master/ro-master.module");
const ro_consumption_module_1 = require("../Silver/ro-consumption/ro-consumption.module");
const ro_inventory_module_1 = require("../Silver/ro-inventory/ro-inventory.module");
const cg_consumption_module_1 = require("../Silver/cg-consumption/cg-consumption.module");
const cg_inventory_module_1 = require("../Silver/cg-inventory/cg-inventory.module");
const cg_order_module_1 = require("../Silver/cg-order/cg-order.module");
const ro_order_module_1 = require("../Silver/ro-order/ro-order.module");
const group_module_1 = require("../Silver/group/group.module");
const brand_module_1 = require("../Silver/brand/brand.module");
const unit_module_1 = require("../Silver/unit/unit.module");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            ro_master_module_1.RoMasterModule,
            silver_product_module_1.SilverProductModule,
            silver_category_module_1.SilverCategoryModule,
            silver_sub_category_module_1.SilverSubCategoryModule,
            ro_consumption_module_1.RoConsumptionModule,
            ro_inventory_module_1.RoInventoryModule,
            ro_inventory_module_1.RoInventoryModule,
            cg_consumption_module_1.CgConsumptionModule,
            cg_inventory_module_1.CgInventoryModule,
            cg_order_module_1.CgOrderModule,
            ro_order_module_1.RoOrderModule,
            unit_module_1.SilverUnitModule,
            brand_module_1.BrandModule,
            group_module_1.GroupModule
        ],
        controllers: [],
        providers: [],
    })
], UserModule);
exports.UserModule = UserModule;
;
//# sourceMappingURL=user.module.js.map