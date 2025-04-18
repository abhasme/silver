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
exports.CgOrderSchema = exports.CgOrder = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const role_enum_1 = require("../../common/enums/role.enum");
let CgOrder = class CgOrder {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'silverproducts', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgOrder.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'roinventories', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgOrder.prototype, "inventoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgOrder.prototype, "qty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true, default: "" }),
    __metadata("design:type", String)
], CgOrder.prototype, "uniqueOrderKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true, default: "" }),
    __metadata("design:type", String)
], CgOrder.prototype, "plant", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: role_enum_1.Permissionstatus, default: role_enum_1.Permissionstatus }),
    __metadata("design:type", String)
], CgOrder.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgOrder.prototype, "tog", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgOrder.prototype, "onHandStock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgOrder.prototype, "openOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgOrder.prototype, "qualifiedDemand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], CgOrder.prototype, "netFlow", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 1 }),
    __metadata("design:type", Number)
], CgOrder.prototype, "uniqueNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 1 }),
    __metadata("design:type", Number)
], CgOrder.prototype, "partialUniqueNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {
            status: true,
            stage: "RECOMMENDATION",
            createdAt: new Date(),
            qty: 0,
        },
    }),
    __metadata("design:type", Object)
], CgOrder.prototype, "recommendation", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {
            status: true,
            stage: "PENDING",
            createdAt: new Date(),
            qty: 0,
        },
    }),
    __metadata("design:type", Object)
], CgOrder.prototype, "cg", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {
            status: false,
            stage: "PENDING",
            createdAt: new Date(),
            qty: 0,
            isChangeQty: false,
            isPartialDispatch: false,
            partialDispatchQty: 0
        },
    }),
    __metadata("design:type", Object)
], CgOrder.prototype, "wip", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {
            status: false,
            stage: "PENDING",
            createdAt: new Date(),
            qty: 0,
            isPartialDispatch: false,
            partialDispatchQty: 0,
        },
    }),
    __metadata("design:type", Object)
], CgOrder.prototype, "in_trasit", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {
            status: false,
            stage: "PENDING",
            createdAt: new Date(),
            qty: 0,
        },
    }),
    __metadata("design:type", Object)
], CgOrder.prototype, "grn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], CgOrder.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CgOrder.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], CgOrder.prototype, "active", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], CgOrder.prototype, "isInTransit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], CgOrder.prototype, "isWip", void 0);
CgOrder = __decorate([
    (0, mongoose_1.Schema)()
], CgOrder);
exports.CgOrder = CgOrder;
exports.CgOrderSchema = mongoose_1.SchemaFactory.createForClass(CgOrder);
//# sourceMappingURL=cgOrder.js.map