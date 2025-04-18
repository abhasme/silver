"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilverSubcategorySchema = exports.SilverSubcategory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SilverSubcategory = class SilverSubcategory {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true, index: true, unique: true, sparse: true }),
    __metadata("design:type", String)
], SilverSubcategory.prototype, "subcategoryName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, trim: true, index: true, unique: true, sparse: true }),
    __metadata("design:type", Number)
], SilverSubcategory.prototype, "subCategoryCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'Category', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SilverSubcategory.prototype, "categoryid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], SilverSubcategory.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], SilverSubcategory.prototype, "active", void 0);
SilverSubcategory = __decorate([
    (0, mongoose_1.Schema)()
], SilverSubcategory);
exports.SilverSubcategory = SilverSubcategory;
exports.SilverSubcategorySchema = mongoose_1.SchemaFactory.createForClass(SilverSubcategory);
//# sourceMappingURL=silverSubCategory.js.map