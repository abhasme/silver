"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilverSubCategoryModule = void 0;
const common_1 = require("@nestjs/common");
const sub_category_service_1 = require("../../services/Silver/sub-category.service");
const silver_sub_category_controller_1 = require("../silver-sub-category/silver-sub-category.controller");
const login_middleware_1 = require("../../common/middleware/login.middleware");
const silverSubCategory_1 = require("../../entities/Silver/silverSubCategory");
const silverCategory_entity_1 = require("../../entities/Silver/silverCategory.entity");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const mongoose_1 = require("@nestjs/mongoose");
let SilverSubCategoryModule = class SilverSubCategoryModule {
    configure(consumer) {
        consumer.apply(login_middleware_1.LoginMiddleware).forRoutes(silver_sub_category_controller_1.SilverSubCategoryController);
    }
};
SilverSubCategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: silverSubCategory_1.SilverSubcategory.name, schema: silverSubCategory_1.SilverSubcategorySchema },
                { name: silverCategory_entity_1.SilverCategory.name, schema: silverCategory_entity_1.SilverCategorySchema },
                { name: silverProductMaster_1.SilverProduct.name, schema: silverProductMaster_1.SilverProductSchema }
            ])],
        controllers: [silver_sub_category_controller_1.SilverSubCategoryController],
        providers: [sub_category_service_1.SilverSubcategoryService]
    })
], SilverSubCategoryModule);
exports.SilverSubCategoryModule = SilverSubCategoryModule;
//# sourceMappingURL=silver-sub-category.module.js.map