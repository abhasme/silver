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
exports.SilverProductSchema = exports.SilverProduct = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SilverProduct = class SilverProduct {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true, index: true, unique: true, sparse: true }),
    __metadata("design:type", String)
], SilverProduct.prototype, "itemCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], SilverProduct.prototype, "itemDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], SilverProduct.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'SilverCategory', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SilverProduct.prototype, "categoryid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'SilverSubcategory', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SilverProduct.prototype, "subcategoryid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: false, ref: 'Unit', index: true, default: "" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SilverProduct.prototype, "unitid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: false, ref: 'Brand', index: true, default: "" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SilverProduct.prototype, "brandid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: false, ref: 'Group', index: true, default: "" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SilverProduct.prototype, "groupid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", String)
], SilverProduct.prototype, "LP", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], SilverProduct.prototype, "HP", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], SilverProduct.prototype, "KW", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], SilverProduct.prototype, "productStage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], SilverProduct.prototype, "modelNo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", Number)
], SilverProduct.prototype, "suc_del", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], SilverProduct.prototype, "discount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", String)
], SilverProduct.prototype, "finalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], SilverProduct.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SilverProduct.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], SilverProduct.prototype, "active", void 0);
SilverProduct = __decorate([
    (0, mongoose_1.Schema)()
], SilverProduct);
exports.SilverProduct = SilverProduct;
;
exports.SilverProductSchema = mongoose_1.SchemaFactory.createForClass(SilverProduct);
//# sourceMappingURL=silverProductMaster.js.map