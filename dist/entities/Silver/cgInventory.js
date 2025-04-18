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
exports.CgInventorySchema = exports.CgInventory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const role_enum_1 = require("../../common/enums/role.enum");
let CgInventory = class CgInventory {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'siliverproduct', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgInventory.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'roinventories', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgInventory.prototype, "roInventoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'cgconsumptions', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgInventory.prototype, "consumptionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'cgorders', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgInventory.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "tog", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "avgWeeklyConsumption", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "roSigma", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "plantLeadTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "togRecommendation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "oldTogRecommendation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true, default: 0 }),
    __metadata("design:type", String)
], CgInventory.prototype, "growthFactor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], CgInventory.prototype, "isGrowthFactor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], CgInventory.prototype, "isConvertFinalToTog", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "onHandStock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "openOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "qualifiedDemand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "netFlow", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "orderRecommendation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "moq", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], CgInventory.prototype, "orderRecommendationStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], CgInventory.prototype, "onHandStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: role_enum_1.Permissionstatus, default: "BLACK" }),
    __metadata("design:type", String)
], CgInventory.prototype, "flag", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgInventory.prototype, "consumption", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], CgInventory.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgInventory.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], CgInventory.prototype, "active", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], CgInventory.prototype, "isUpdateInventory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], CgInventory.prototype, "isUpdateTog", void 0);
CgInventory = __decorate([
    (0, mongoose_1.Schema)()
], CgInventory);
exports.CgInventory = CgInventory;
exports.CgInventorySchema = mongoose_1.SchemaFactory.createForClass(CgInventory);
//# sourceMappingURL=cgInventory.js.map