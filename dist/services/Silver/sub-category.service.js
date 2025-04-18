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
exports.SilverSubcategoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const silverSubCategory_1 = require("../../entities/Silver/silverSubCategory");
const silverCategory_entity_1 = require("../../entities/Silver/silverCategory.entity");
const jwt_helper_1 = require("../../common/utils/jwt.helper");
const response_subcategory_dto_1 = require("../../Silver/silver-sub-category/dto/response-subcategory.dto");
let SilverSubcategoryService = class SilverSubcategoryService {
    constructor(subcategoryModel, productModel, categoryModel) {
        this.subcategoryModel = subcategoryModel;
        this.productModel = productModel;
        this.categoryModel = categoryModel;
    }
    ;
    async createSubcategory(createSubcategoryDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            if (!createSubcategoryDto.categoryid) {
                throw new common_1.BadRequestException("Category id not found");
            }
            const findSubcatrgory = await this.subcategoryModel.find({ subcategoryName: createSubcategoryDto.subcategoryName });
            if (findSubcatrgory.length > 0) {
                throw new common_1.BadRequestException("subCategory already exist");
            }
            const findSubcatrgoryCode = await this.subcategoryModel.find({ subCategoryCode: createSubcategoryDto.subCategoryCode });
            if (findSubcatrgoryCode.length > 0) {
                throw new common_1.BadRequestException("subCategory code already exist");
            }
            const subcategory = new this.subcategoryModel(Object.assign(Object.assign({}, createSubcategoryDto), { createdBy: authInfo._id }));
            if (subcategory.save()) {
                return new response_subcategory_dto_1.GetSubcategoryInfoDto(subcategory);
            }
            throw new common_1.BadRequestException('Error in Create Subcategory');
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getAllSubcategory(paginationDto) {
        try {
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const searchQuery = paginationDto.search || "";
            const orderByFields = paginationDto.orderBy || ["createdAt"];
            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false };
            }
            const categories = await this.subcategoryModel.aggregate([
                {
                    $match: activeCondition
                },
                {
                    $facet: {
                        paginate: [
                            { $match: { $or: [{ subcategoryName: { $regex: searchQuery, $options: "i" } }, { subcategoryCode: { $regex: searchQuery, $options: "i" } }] } },
                            { $count: "totalDocs" },
                            { $addFields: { recordPerPage: recordPerPage, currentPage: currentPage } }
                        ],
                        docs: [
                            { $match: { $or: [{ subcategoryName: { $regex: searchQuery, $options: "i" } }, { subcategoryCode: { $regex: searchQuery, $options: "i" } }] } },
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
    async getSubcategoriesByCategoryId(paginationDto) {
        try {
            const subcategories = await this.subcategoryModel.aggregate([{ $match: { categoryid: ObjectId(paginationDto.categoryId), active: true } }]).exec();
            if (!subcategories || !subcategories[0]) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return subcategories;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getSubcategoryInfo(id) {
        try {
            const data = await this.subcategoryModel.aggregate([
                { $match: { "_id": ObjectId(id) } },
                {
                    $lookup: {
                        from: "silvercategories",
                        localField: "categoryid",
                        foreignField: "_id",
                        as: "categoryInfo",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        subcategoryName: { $ifNull: ["$subcategoryName", ""] },
                        subCategoryCode: { $ifNull: ["$subCategoryCode", ""] },
                        categoryid: { $ifNull: ["$categoryid", ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        active: { $ifNull: ["$active", false] },
                    },
                },
                { $limit: 1 },
            ]).exec();
            if (!data) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return new response_subcategory_dto_1.GetSubcategoryInfoDto(data[0]);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateSubcategoryInfo(id, updateSubcategoryDto) {
        try {
            const findSubcatrgory = await this.subcategoryModel.find({ subcategoryName: updateSubcategoryDto.subcategoryName, _id: { $ne: ObjectId(id) } });
            if (findSubcatrgory.length > 0) {
                throw new common_1.BadRequestException("subCategory already exist");
            }
            return await this.subcategoryModel.findByIdAndUpdate(id, updateSubcategoryDto, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async deleteSubcategory(id) {
        try {
            return await this.subcategoryModel.findByIdAndDelete(id);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateStatus(id, statusSubcategoryDto) {
        try {
            if (statusSubcategoryDto.active === false) {
                await this.productModel.updateMany({ subcategoryid: ObjectId(statusSubcategoryDto.subcategoryid) }, { active: statusSubcategoryDto.active }, { new: true, useFindAndModify: false });
            }
            return await this.subcategoryModel.findByIdAndUpdate(statusSubcategoryDto.subcategoryid, { active: statusSubcategoryDto.active }, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async importSubCategory(createSubcategoryDto) {
        try {
            let errorArrray = [];
            const dataArray = Array.isArray(createSubcategoryDto) ? createSubcategoryDto : Object.values(createSubcategoryDto);
            const mappedArray = await Promise.all(dataArray.map(async (category) => {
                const existCategory = await this.categoryModel.findOne({ categoryName: category.categoryName }).select('_id').exec();
                const existSubCategory = await this.subcategoryModel.findOne({ subcategoryName: category.subcategoryName }).select('_id').exec();
                let errString = "";
                const checkBlank = (property, errorMessage) => {
                    if (property === "" || property === null || property === "null") {
                        errString += `${errorMessage} ,`;
                    }
                };
                await checkBlank(category.categoryName, "categoryName is blank");
                await checkBlank(category.categoryName, "subcategoryCode is blank");
                await checkBlank(category.subcategoryName, "subcategoryName is blank");
                if (!errString) {
                    if (!existSubCategory && existCategory) {
                        await this.subcategoryModel.create(Object.assign(Object.assign({}, category), { categoryid: existCategory._id }));
                    }
                    else if (existSubCategory && existCategory) {
                        errString += `Sub category exist`;
                    }
                }
                if (errString !== "") {
                    category["error"] = errString;
                    errorArrray.push(category);
                }
            }));
            return new response_subcategory_dto_1.GetSubcategoryInfoDto({ mappedArray: mappedArray, errorArrray: errorArrray });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
};
SilverSubcategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(silverSubCategory_1.SilverSubcategory.name)),
    __param(1, (0, mongoose_1.InjectModel)(silverProductMaster_1.SilverProduct.name)),
    __param(2, (0, mongoose_1.InjectModel)(silverCategory_entity_1.SilverCategory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SilverSubcategoryService);
exports.SilverSubcategoryService = SilverSubcategoryService;
;
//# sourceMappingURL=sub-category.service.js.map