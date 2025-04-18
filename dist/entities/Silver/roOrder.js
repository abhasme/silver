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
exports.RoOrderSchema = exports.RoOrder = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const role_enum_1 = require("../../common/enums/role.enum");
let RoOrder = class RoOrder {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'romasters', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RoOrder.prototype, "roId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'roproducts', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RoOrder.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'roinventories', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RoOrder.prototype, "inventoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoOrder.prototype, "qty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true, default: "" }),
    __metadata("design:type", String)
], RoOrder.prototype, "uniqueOrderKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true, default: "" }),
    __metadata("design:type", String)
], RoOrder.prototype, "plant", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: role_enum_1.Permissionstatus, default: role_enum_1.Permissionstatus }),
    __metadata("design:type", String)
], RoOrder.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoOrder.prototype, "tog", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoOrder.prototype, "onHandStock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoOrder.prototype, "openOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoOrder.prototype, "qualifiedDemand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 0 }),
    __metadata("design:type", Number)
], RoOrder.prototype, "netFlow", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 1 }),
    __metadata("design:type", Number)
], RoOrder.prototype, "uniqueNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, index: true, default: 1 }),
    __metadata("design:type", Number)
], RoOrder.prototype, "partialUniqueNumber", void 0);
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
], RoOrder.prototype, "recommendation", void 0);
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
], RoOrder.prototype, "cg", void 0);
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
], RoOrder.prototype, "wip", void 0);
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
], RoOrder.prototype, "in_trasit", void 0);
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
], RoOrder.prototype, "grn", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], RoOrder.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RoOrder.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], RoOrder.prototype, "active", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], RoOrder.prototype, "isInTransit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], RoOrder.prototype, "isWip", void 0);
RoOrder = __decorate([
    (0, mongoose_1.Schema)()
], RoOrder);
exports.RoOrder = RoOrder;
exports.RoOrderSchema = mongoose_1.SchemaFactory.createForClass(RoOrder);
//# sourceMappingURL=roOrder.js.map