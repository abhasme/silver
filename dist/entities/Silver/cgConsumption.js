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
exports.CgConsumptionSchema = exports.CgConsumption = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CgConsumption = class CgConsumption {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'silverproductId', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgConsumption.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'cgInventorys', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgConsumption.prototype, "inventoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'romasters', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgConsumption.prototype, "roId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgConsumption.prototype, "qty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true, default: "" }),
    __metadata("design:type", String)
], CgConsumption.prototype, "opNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], CgConsumption.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], CgConsumption.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgConsumption.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], CgConsumption.prototype, "active", void 0);
CgConsumption = __decorate([
    (0, mongoose_1.Schema)()
], CgConsumption);
exports.CgConsumption = CgConsumption;
exports.CgConsumptionSchema = mongoose_1.SchemaFactory.createForClass(CgConsumption);
//# sourceMappingURL=cgConsumption.js.map