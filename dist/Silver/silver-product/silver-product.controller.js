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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilverProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("../../services/Silver/product.service");
const swagger_1 = require("@nestjs/swagger");
const request_product_dto_1 = require("./dto/request-product.dto");
const response_product_dto_1 = require("./dto/response-product.dto");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const product_dto_1 = require("../../dto/product-dto");
const pagination_dto_1 = require("../../dto/pagination-dto");
let SilverProductController = class SilverProductController {
    constructor(silverProductsService) {
        this.silverProductsService = silverProductsService;
    }
    async createProduct(req, createProductDto) {
        return this.silverProductsService.createProduct(createProductDto, req);
    }
    async getAllProduct(req, paginationDto) {
        const data = await this.silverProductsService.getAllProduct(paginationDto, req);
        return { data };
    }
    async getProductInfo(id) {
        const data = await this.silverProductsService.getProductInfo(id);
        return { data };
    }
    async UpdateProducts(id, productIdDto) {
        const data = await this.silverProductsService.UpdateProducts(id, productIdDto);
        return { data };
    }
    async deleteCategory(id) {
        return await this.silverProductsService.deleteProduct(id);
    }
    async importProducts(req, createProductDto) {
        const data = await this.silverProductsService.importProducts(createProductDto);
        return { data };
    }
    async getProductDropDown(req, searchDto) {
        const data = await this.silverProductsService.getProductDropDown(searchDto, req);
        return { data };
    }
    ;
    async updateStatus(id, statusProductDto) {
        const data = await this.silverProductsService.updateStatus(id, statusProductDto);
        return { data };
    }
    ;
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Login into the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_product_dto_1.GetProductInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'item code already exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], SilverProductController.prototype, "createProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all products' }),
    (0, common_1.Post)("all"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, product_dto_1.FilterPaginationProductDto]),
    __metadata("design:returntype", Promise)
], SilverProductController.prototype, "getAllProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular product details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid product id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_product_dto_1.GetProductInfoDto }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SilverProductController.prototype, "getProductInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Product' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_product_dto_1.CreateProductDto }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], SilverProductController.prototype, "UpdateProducts", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SilverProductController.prototype, "deleteCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add Multiple Product' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_product_dto_1.GetProductInfoDto }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid id or password' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Your email is not verified! Please verify your email address.' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)('importProducts'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], SilverProductController.prototype, "importProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get products drop down' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_product_dto_1.GetProductInfoDto }),
    (0, common_1.Post)("/dropdown"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], SilverProductController.prototype, "getProductDropDown", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid product id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_product_dto_1.GetProductInfoDto }),
    (0, common_1.Patch)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_product_dto_1.StatusProductDto]),
    __metadata("design:returntype", Promise)
], SilverProductController.prototype, "updateStatus", null);
SilverProductController = __decorate([
    (0, common_1.Controller)('silver-product'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [product_service_1.SilverProductsService])
], SilverProductController);
exports.SilverProductController = SilverProductController;
//# sourceMappingURL=silver-product.controller.js.map