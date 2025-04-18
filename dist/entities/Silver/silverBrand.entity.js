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
exports.SilverBrandSchema = exports.SilverBrand = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SilverBrand = class SilverBrand {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true, index: true, unique: true, sparse: true }),
    __metadata("design:type", String)
], SilverBrand.prototype, "brand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, trim: true, index: true, unique: true, sparse: true }),
    __metadata("design:type", Number)
], SilverBrand.prototype, "brandCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], SilverBrand.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], SilverBrand.prototype, "active", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SilverBrand.prototype, "createdBy", void 0);
SilverBrand = __decorate([
    (0, mongoose_1.Schema)()
], SilverBrand);
exports.SilverBrand = SilverBrand;
exports.SilverBrandSchema = mongoose_1.SchemaFactory.createForClass(SilverBrand);
//# sourceMappingURL=silverBrand.entity.js.map