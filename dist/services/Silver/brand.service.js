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
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;
const silverBrand_entity_1 = require("../../entities/Silver/silverBrand.entity");
const users_entity_1 = require("../../entities/users.entity");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const jwt_helper_1 = require("../../common/utils/jwt.helper");
const response_brand_dto_1 = require("../../Silver/brand/dto/response-brand.dto");
let BrandService = class BrandService {
    constructor(silverProductModel, userModel, brandModel) {
        this.silverProductModel = silverProductModel;
        this.userModel = userModel;
        this.brandModel = brandModel;
    }
    ;
    async createBrand(createBrandDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const findUnit = await this.brandModel.findOne({ brand: createBrandDto.brand });
            if (findUnit) {
                return new common_1.BadRequestException("SilverBrand already exist");
            }
            const SilverBrand = new this.brandModel(Object.assign(Object.assign({}, createBrandDto), { createdBy: authInfo._id }));
            if (SilverBrand.save()) {
                return new response_brand_dto_1.GetBrandInfoDto(SilverBrand);
            }
            throw new common_1.BadRequestException('Error in Create SilverBrand');
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getAllBrand(paginationDto, req) {
        try {
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const orderByFields = paginationDto.orderBy || ["createdAt"];
            let searchQuery = {};
            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false };
            }
            if (paginationDto.search != '') {
                searchQuery = { $or: [{ brandCode: Number(paginationDto.search) }, { brand: { $regex: paginationDto.search, '$options': 'i' } }] };
            }
            const units = await this.brandModel.aggregate([
                {
                    $match: activeCondition
                },
                {
                    $match: searchQuery,
                },
                {
                    $facet: {
                        paginate: [
                            { $count: "totalDocs" },
                            { $addFields: { recordPerPage: recordPerPage, currentPage: currentPage } }
                        ],
                        docs: [
                            { $sort: { [orderByFields[0]]: -1 } },
                            { $skip: (currentPage - 1) * recordPerPage },
                            { $limit: recordPerPage }
                        ]
                    }
                }
            ]).exec();
            if (!units || !units[0]) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return units;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getBrandInfo(id) {
        try {
            const SilverBrand = await this.brandModel.aggregate([{ $match: { _id: ObjectId(id) } }]).exec();
            if (!SilverBrand || !SilverBrand[0]) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return SilverBrand;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async deleteBrand(id) {
        try {
            return await this.brandModel.findByIdAndDelete(id);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async UpdateBrand(id, updateBrandDto) {
        try {
            const findUnit = await this.brandModel.find({ brand: updateBrandDto.brand, _id: { $ne: id } });
            if (findUnit.length > 0) {
                throw new common_1.BadRequestException("SilverBrand not exist");
            }
            return await this.brandModel.findByIdAndUpdate(id, updateBrandDto, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getBrandDropDown(searchDto, req) {
        var _a;
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const user = await this.userModel.findOne({ _id: ObjectId(authInfo._id), userType: "ROTEX" });
            let productObj = {};
            if (user) {
                const units = (_a = user === null || user === void 0 ? void 0 : user.units) !== null && _a !== void 0 ? _a : [];
                productObj = { _id: { $in: units } };
            }
            let searchQuery = {};
            if (searchDto.search != '') {
                searchQuery = { SilverBrand: Number(searchDto.search) };
            }
            else {
                searchQuery = {};
            }
            const data = await this.brandModel.aggregate([
                { $match: { active: true } },
                {
                    $match: productObj
                },
                {
                    $project: {
                        _id: 1,
                        brand: { $ifNull: ["$brand", ""] },
                        brandCode: { $ifNull: ["$brandCode", 0] },
                        createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
                    },
                },
            ]).exec();
            if (!data) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return data;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateBrandStatus(id, updateStatusBrandDto) {
        try {
            let findUnit = await this.brandModel.findOne({ _id: ObjectId(id) });
            if (!findUnit) {
                throw new common_1.BadRequestException("SilverBrand not exit");
            }
            if (updateStatusBrandDto.active == false) {
                await this.silverProductModel.updateMany({ unitid: ObjectId(id) }, { active: updateStatusBrandDto.active }, { new: true, useFindAndModify: false });
            }
            return await this.brandModel.findByIdAndUpdate({ _id: ObjectId(id) }, { active: updateStatusBrandDto.active }, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
};
BrandService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(silverProductMaster_1.SilverProduct.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(silverBrand_entity_1.SilverBrand.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], BrandService);
exports.BrandService = BrandService;
;
//# sourceMappingURL=brand.service.js.map