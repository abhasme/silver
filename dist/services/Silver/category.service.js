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
exports.SilverCategoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const ObjectId = require('mongoose').Types.ObjectId;
const silverCategory_entity_1 = require("../../entities/Silver/silverCategory.entity");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const silverSubCategory_1 = require("../../entities/Silver/silverSubCategory");
const response_category_dto_1 = require("../../Silver/silver-category/dto/response-category.dto");
const jwt_helper_1 = require("../../common/utils/jwt.helper");
let SilverCategoryService = class SilverCategoryService {
    constructor(categoryModel, productModel, subcategoryModel) {
        this.categoryModel = categoryModel;
        this.productModel = productModel;
        this.subcategoryModel = subcategoryModel;
    }
    ;
    async createCategory(createCategoryDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const findCatrgory = await this.categoryModel.find({ categoryName: createCategoryDto.categoryName });
            if (findCatrgory.length > 0) {
                throw new common_1.BadRequestException(" category already exist");
            }
            const category = new this.categoryModel(Object.assign(Object.assign({}, createCategoryDto), { createdBy: authInfo._id }));
            if (category.save()) {
                return new response_category_dto_1.GetCategoryInfoDto(category);
            }
            throw new common_1.BadRequestException('Error in Create Category');
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getAllCategories(paginationDto) {
        try {
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const searchQuery = paginationDto.search || "";
            const orderByFields = paginationDto.orderBy || ["createdAt"];
            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false };
            }
            const categories = await this.categoryModel.aggregate([
                { $match: activeCondition },
                {
                    $facet: {
                        paginate: [
                            { $match: { $or: [{ categoryName: { $regex: searchQuery, $options: "i" } }, { categoryCode: { $regex: searchQuery, $options: "i" } }] } },
                            { $count: "totalDocs" },
                            { $addFields: { recordPerPage: recordPerPage, currentPage: currentPage } }
                        ],
                        docs: [
                            { $match: { $or: [{ categoryName: { $regex: searchQuery, $options: "i" } }, { categoryCode: { $regex: searchQuery, $options: "i" } }] } },
                            { $sort: { [orderByFields[0]]: -1 } },
                            { $skip: (currentPage - 1) * recordPerPage },
                            { $limit: recordPerPage }
                        ]
                    }
                }
            ]).exec();
            if (!categories || !categories[0]) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return categories;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getCategoryInfo(id) {
        try {
            const data = await this.categoryModel.aggregate([
                { $match: { "_id": ObjectId(id) } },
                {
                    $project: {
                        _id: 1,
                        categoryName: { $ifNull: ["$categoryName", ""] },
                        categoryCode: { $ifNull: ["$categoryCode", ""] },
                        active: { $ifNull: ["$active", false] },
                    },
                },
                { $limit: 1 },
            ]).exec();
            if (!data) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return new response_category_dto_1.GetCategoryInfoDto(data[0]);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateCategoryInfo(id, updateCategoryDto) {
        try {
            const findCatrgory = await this.categoryModel.find({ categoryName: updateCategoryDto.categoryName, _id: { $ne: ObjectId(id) } });
            if (findCatrgory.length > 0) {
                throw new common_1.BadRequestException("  category already exist");
            }
            return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async deleteCategory(id) {
        try {
            return await this.categoryModel.findByIdAndDelete(id);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateStatus(id, statusCategoryDto) {
        try {
            if (statusCategoryDto.active === false) {
                await this.productModel.updateMany({ categoryid: statusCategoryDto.categoryid }, { active: statusCategoryDto.active }, { new: true, useFindAndModify: false });
                await this.subcategoryModel.updateMany({ categoryid: statusCategoryDto.categoryid }, { active: statusCategoryDto.active }, { new: true, useFindAndModify: false });
            }
            return await this.categoryModel.findByIdAndUpdate(statusCategoryDto.categoryid, { active: statusCategoryDto.active }, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async importCategory(req, importCategoryDto) {
        try {
            let errorArrray = [];
            const dataArray = Array.isArray(importCategoryDto) ? importCategoryDto : Object.values(importCategoryDto);
            const mappedArray = await Promise.all(dataArray.map(async (category) => {
                const existCategory = await this.categoryModel.findOne({ categoryName: category.categoryName }).select('_id').exec();
                let errString = "";
                const checkBlank = (property, errorMessage) => {
                    if (property === "" || property === null || property === "null") {
                        errString += `${errorMessage} ,`;
                    }
                };
                const checkExist = (property, errorMessage) => {
                    if (!property) {
                        errString += `${errorMessage} ,`;
                    }
                };
                await checkBlank(category.categoryName, "categoryName is blank");
                await checkBlank(category.categoryName, "categoryCode is blank");
                if (!errString) {
                    if (!existCategory) {
                        await this.categoryModel.create(Object.assign({}, category));
                    }
                    else {
                        errString += `category exist`;
                    }
                }
                if (errString !== "") {
                    category["error"] = errString;
                    errorArrray.push(category);
                }
            }));
            return new response_category_dto_1.GetCategoryInfoDto({ mappedArray: mappedArray, errorArrray: errorArrray });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getCategoryDropDown(searchDto) {
        try {
            const data = await this.categoryModel.aggregate([
                { $match: { active: true } },
                {
                    $project: {
                        _id: 0,
                        label: { $ifNull: ["$categoryName", ""] },
                        value: { $ifNull: ["$_id", ""] },
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
};
SilverCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(silverCategory_entity_1.SilverCategory.name)),
    __param(1, (0, mongoose_2.InjectModel)(silverProductMaster_1.SilverProduct.name)),
    __param(2, (0, mongoose_2.InjectModel)(silverSubCategory_1.SilverSubcategory.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], SilverCategoryService);
exports.SilverCategoryService = SilverCategoryService;
;
//# sourceMappingURL=category.service.js.map