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
exports.CgGrowthFactorSchema = exports.CgGrowthFactor = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CgGrowthFactor = class CgGrowthFactor {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'cginventories', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgGrowthFactor.prototype, "cgInventoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'roinventories', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgGrowthFactor.prototype, "roInventoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], CgGrowthFactor.prototype, "isUpdateGrowthFactor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 1 }),
    __metadata("design:type", Number)
], CgGrowthFactor.prototype, "orderNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], CgGrowthFactor.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgGrowthFactor.prototype, "createdBy", void 0);
CgGrowthFactor = __decorate([
    (0, mongoose_1.Schema)()
], CgGrowthFactor);
exports.CgGrowthFactor = CgGrowthFactor;
exports.CgGrowthFactorSchema = mongoose_1.SchemaFactory.createForClass(CgGrowthFactor);
//# sourceMappingURL=cggrowthFactorInfo.js.map