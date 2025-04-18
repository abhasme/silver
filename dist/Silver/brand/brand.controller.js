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
exports.BrandController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const brand_service_1 = require("../../services/Silver/brand.service");
const request_brand_dto_1 = require("./dto/request-brand.dto");
const response_brand_dto_1 = require("./dto/response-brand.dto");
const transform_interceptor_1 = require("../../common/dispatchers/transform.interceptor");
const mongoose_1 = require("mongoose");
const pagination_dto_1 = require("../../dto/pagination-dto");
let BrandController = class BrandController {
    constructor(brandService) {
        this.brandService = brandService;
    }
    async createBrand(req, createBrandDto) {
        return this.brandService.createBrand(createBrandDto, req);
    }
    ;
    async getAllBrand(req, paginationDto) {
        const data = await this.brandService.getAllBrand(paginationDto, req);
        return { data };
    }
    ;
    async getBrandInfo(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid unit ID');
        }
        const data = await this.brandService.getBrandInfo(id);
        return { data };
    }
    ;
    async deleteBrand(id) {
        return await this.brandService.deleteBrand(id);
    }
    ;
    async UpdateBrand(id, updateBrandIdDto) {
        const data = await this.brandService.UpdateBrand(id, updateBrandIdDto);
        return { data };
    }
    ;
    async getBrandDropDown(req, searchDto) {
        const data = await this.brandService.getBrandDropDown(searchDto, req);
        return { data };
    }
    ;
    async updateBrandStatus(id, updateBrandStatusDto) {
        const data = await this.brandService.updateBrandStatus(id, updateBrandStatusDto);
        return { data };
    }
    ;
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add brand' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_brand_dto_1.GetBrandInfoDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Brand already exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_brand_dto_1.CreateBrandDto]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "createBrand", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all brand' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: response_brand_dto_1.GetBrandInfoDto }),
    (0, common_1.Post)('/all'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, request_brand_dto_1.FilterPaginationBrandDto]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "getAllBrand", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get paticular brand details' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid brand id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_brand_dto_1.GetBrandInfoDto }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "getBrandInfo", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "deleteBrand", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update brand' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: request_brand_dto_1.UpdateBrandDto }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Brand already exist' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_brand_dto_1.UpdateBrandDto]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "UpdateBrand", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get unit DropDown' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'unit is available', type: response_brand_dto_1.GetBrandInfoDto }),
    (0, common_1.Get)('/dropdown/list'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "getBrandDropDown", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update status' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Login required' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid unit id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Success', type: response_brand_dto_1.GetBrandInfoDto }),
    (0, common_1.Patch)('/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_brand_dto_1.UpdateStatusBrandDto]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "updateBrandStatus", null);
BrandController = __decorate([
    (0, common_1.Controller)('silver-brand'),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal server error' }),
    (0, common_1.UseInterceptors)(transform_interceptor_1.TransformInterceptor),
    __metadata("design:paramtypes", [brand_service_1.BrandService])
], BrandController);
exports.BrandController = BrandController;
//# sourceMappingURL=brand.controller.js.map