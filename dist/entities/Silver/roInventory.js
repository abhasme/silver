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
exports.RoInventorySchema = exports.RoInventory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const role_enum_1 = require("../../common/enums/role.enum");
let RoInventory = class RoInventory {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'romasters', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RoInventory.prototype, "roId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'siliverproduct', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RoInventory.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'roconsumptions', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RoInventory.prototype, "consumptionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'roorders', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RoInventory.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "tog", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "rWC", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "leadTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "stockUpWeeks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true, default: 0 }),
    __metadata("design:type", String)
], RoInventory.prototype, "growthFactor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], RoInventory.prototype, "isGrowthFactor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "onHandStock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "openOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "qualifiedDemand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "netFlow", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "orderRecommendation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], RoInventory.prototype, "orderRecommendationStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], RoInventory.prototype, "onHandStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "moq", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: role_enum_1.Permissionstatus, default: "BLACK" }),
    __metadata("design:type", String)
], RoInventory.prototype, "flag", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "consumption", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], RoInventory.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RoInventory.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], RoInventory.prototype, "active", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], RoInventory.prototype, "isUpdateInventory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], RoInventory.prototype, "isUpdateTog", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "LYM", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "CYM", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "L13", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "LBS", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "SWB", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "togRecommendation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "finalTog", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoInventory.prototype, "oldTog", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], RoInventory.prototype, "isConvertFinalToTog", void 0);
RoInventory = __decorate([
    (0, mongoose_1.Schema)()
], RoInventory);
exports.RoInventory = RoInventory;
exports.RoInventorySchema = mongoose_1.SchemaFactory.createForClass(RoInventory);
//# sourceMappingURL=roInventory.js.map