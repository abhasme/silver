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
exports.SilverProductsService = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const ObjectId = require('mongoose').Types.ObjectId;
const common_1 = require("@nestjs/common");
const users_entity_1 = require("../../entities/users.entity");
const cgOrder_1 = require("../../entities/Silver/cgOrder");
const roOrder_1 = require("../../entities/Silver/roOrder");
const cgInventory_1 = require("../../entities/Silver/cgInventory");
const roInventory_1 = require("../../entities/Silver/roInventory");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const silverCategory_entity_1 = require("../../entities/Silver/silverCategory.entity");
const silverSubCategory_1 = require("../../entities/Silver/silverSubCategory");
const cgConsumption_1 = require("../../entities/Silver/cgConsumption");
const roConsumption_1 = require("../../entities/Silver/roConsumption");
const silverBrand_entity_1 = require("../../entities/Silver/silverBrand.entity");
const silverGroup_entity_1 = require("../../entities/Silver/silverGroup.entity");
const silverUnit_entity_1 = require("../../entities/Silver/silverUnit.entity");
const jwt_helper_1 = require("../../common/utils/jwt.helper");
const response_product_dto_1 = require("../../Silver/silver-product/dto/response-product.dto");
let SilverProductsService = class SilverProductsService {
    constructor(productModel, categoryModel, userModel, cgInventoryModel, roInventoryModel, cgOrderModel, roOrderModel, cgConsumptionModel, roConsumptionModel, subcategoryModel, brandModel, groupModel, unitModel) {
        this.productModel = productModel;
        this.categoryModel = categoryModel;
        this.userModel = userModel;
        this.cgInventoryModel = cgInventoryModel;
        this.roInventoryModel = roInventoryModel;
        this.cgOrderModel = cgOrderModel;
        this.roOrderModel = roOrderModel;
        this.cgConsumptionModel = cgConsumptionModel;
        this.roConsumptionModel = roConsumptionModel;
        this.subcategoryModel = subcategoryModel;
        this.brandModel = brandModel;
        this.groupModel = groupModel;
        this.unitModel = unitModel;
    }
    ;
    async createProduct(createProductDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const findItemCode = await this.productModel.find({ itemCode: createProductDto.itemCode });
            if (findItemCode.length > 0) {
                throw new common_1.BadRequestException("item code already exist");
            }
            const findProductName = await this.productModel.find({ productName: createProductDto.productName });
            if (findProductName.length > 0) {
                throw new common_1.BadRequestException("productName already exist");
            }
            const product = new this.productModel(Object.assign(Object.assign({}, createProductDto), { createdBy: authInfo._id }));
            if (product.save()) {
                return new response_product_dto_1.GetProductInfoDto(product);
            }
            throw new common_1.BadRequestException('Error in Create SilverProduct');
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getAllProduct(paginationDto, req) {
        try {
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 100;
            const sortFields = {};
            let dynamicSortFields = ["id"];
            if (paginationDto.sortBy && paginationDto.sortBy.length > 0) {
                let dynamicSortFields = paginationDto.sortBy;
                dynamicSortFields.forEach(field => {
                    if (field.orderValue == 1) {
                        sortFields[field.orderKey] = 1;
                    }
                    else {
                        sortFields[field.orderKey] = -1;
                    }
                });
            }
            else {
                sortFields["createdAt"] = -1;
            }
            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false };
            }
            const filter = await (0, jwt_helper_1.multiSelectorFunction)(paginationDto);
            const data = await this.productModel.aggregate([
                { $match: activeCondition },
                {
                    $lookup: {
                        from: "silvercategories",
                        localField: "categoryid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, categoryName: 1 } }
                        ],
                        as: "categoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silversubcategories",
                        localField: "subcategoryid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, subcategoryName: 1 } }
                        ],
                        as: "subcategoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silverunits",
                        localField: "unitid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, unitCode: 1, unit: 1 } }
                        ],
                        as: "unitInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvergroups",
                        localField: "groupid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, groupCode: 1, group: 1 } }
                        ],
                        as: "groupInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silverbrands",
                        localField: "brandid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, brandCode: 1, brand: 1 } }
                        ],
                        as: "brandInfo",
                    },
                },
                { $unwind: { path: "$brandInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$groupInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$unitInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$subcategoryInfo", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        unitid: 1,
                        brandid: 1,
                        groupid: 1,
                        itemCode: { $ifNull: ["$itemCode", ""] },
                        itemDescription: { $ifNull: ["$itemDescription", ""] },
                        productName: { $ifNull: ["$productName", ""] },
                        categoryid: { $ifNull: ["$categoryid", ""] },
                        categoryName: { $ifNull: ["$categoryInfo.categoryName", ""] },
                        subcategoryid: { $ifNull: ["$subcategoryid", ""] },
                        subcategoryName: { $ifNull: ["$subcategoryInfo.subcategoryName", ""] },
                        unit: { $ifNull: ["$unitInfo.unit", ""] },
                        unitCode: { $ifNull: ["$unitInfo.unitCode", ""] },
                        group: { $ifNull: ["$groupInfo.group", ""] },
                        groupCode: { $ifNull: ["$groupInfo.groupCode", ""] },
                        brandCode: { $ifNull: ["$brandInfo.brandCode", ""] },
                        brand: { $ifNull: ["$brandInfo.brand", ""] },
                        moq: { $ifNull: ["$moq", ""] },
                        LP: { $ifNull: ["$LP", 0] },
                        HP: { $ifNull: ["$HP", ""] },
                        KW: { $ifNull: ["$KW", ""] },
                        productStage: { $ifNull: ["$productStage", ""] },
                        modelNo: { $ifNull: ["$modelNo", ""] },
                        suc_del: { $ifNull: ["$suc_del", ""] },
                        discount: { $ifNull: ["$discount", ""] },
                        finalPrice: { $ifNull: ["$finalPrice", ""] },
                        active: { $ifNull: ["$active", false] },
                        productPrice: { $ifNull: ["$productPrice", 0] },
                        manufactureLeadTime: { $ifNull: ["$manufactureLeadTime", 0] },
                        weight: { $ifNull: ["$weight", 0] },
                        createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
                    },
                },
                {
                    $match: filter
                },
                {
                    $match: {
                        $or: [
                            { discount: { $regex: paginationDto.search, '$options': 'i' } },
                            { finalPrice: { $regex: paginationDto.search, '$options': 'i' } },
                            { itemCode: { $regex: paginationDto.search, '$options': 'i' } },
                            { productName: { $regex: paginationDto.search, '$options': 'i' } },
                            { subcategoryName: { $regex: paginationDto.search, '$options': 'i' } },
                            { categoryName: { $regex: paginationDto.search, '$options': 'i' } },
                            { itemDescription: { $eq: paginationDto.search } },
                            { itemDescription: { $regex: paginationDto.search, '$options': 'i' } },
                            { KW: { $regex: paginationDto.search, '$options': 'i' } },
                            { LP: { $regex: paginationDto.search, '$options': 'i' } },
                            { HP: { $regex: paginationDto.search, '$options': 'i' } },
                            { productStage: { $regex: paginationDto.search, '$options': 'i' } },
                            { modelNo: { $regex: paginationDto.search, '$options': 'i' } },
                            { suc_del: { $regex: paginationDto.search, '$options': 'i' } },
                            { unit: { $regex: paginationDto.search, '$options': 'i' } },
                            { group: { $regex: paginationDto.search, '$options': 'i' } },
                            { brand: { $regex: paginationDto.search, '$options': 'i' } },
                        ],
                    },
                },
                { $sort: sortFields },
                {
                    $facet: {
                        paginate: [
                            { $count: "totalDocs" },
                            { $addFields: { recordPerPage: recordPerPage, currentPage: currentPage } }
                        ],
                        docs: [
                            { $skip: (currentPage - 1) * recordPerPage },
                            { $limit: recordPerPage }
                        ]
                    }
                }
            ]).exec();
            if (!data) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return data[0];
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getProductInfo(id) {
        try {
            const data = await this.productModel.aggregate([
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
                    $lookup: {
                        from: "silversubcategories",
                        localField: "subcategoryid",
                        foreignField: "_id",
                        as: "subcategoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silverunits",
                        localField: "unitid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, unitCode: 1, unit: 1 } }
                        ],
                        as: "unitInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvergroups",
                        localField: "groupid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, groupCode: 1, group: 1 } }
                        ],
                        as: "groupInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silverbrands",
                        localField: "brandid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, brandCode: 1, brand: 1 } }
                        ],
                        as: "brandInfo",
                    },
                },
                { $unwind: { path: "$brandInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$groupInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$unitInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: "$categoryInfo" },
                { $unwind: "$subcategoryInfo" },
                {
                    $project: {
                        _id: 1,
                        unitid: 1,
                        groupid: 1,
                        brandid: 1,
                        moq: { $ifNull: ["$moq", ""] },
                        active: { $ifNull: ["$active", false] },
                        itemCode: { $ifNull: ["$itemCode", 0] },
                        itemDescription: { $ifNull: ["$itemDescription", ""] },
                        productName: { $ifNull: ["$productName", ""] },
                        categoryid: { $ifNull: ["$categoryid", ""] },
                        categoryName: { $ifNull: ["$categoryInfo.categoryName", ""] },
                        subcategoryid: { $ifNull: ["$subcategoryid", ""] },
                        subcategoryName: { $ifNull: ["$subcategoryInfo.subcategoryName", ""] },
                        createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
                        productPrice: { $ifNull: ["$productPrice", 0] },
                        weight: { $ifNull: ["$weight", 0] },
                        manufactureLeadTime: { $ifNull: ["$manufactureLeadTime", 0] },
                        unit: { $ifNull: ["$unitInfo.unit", ""] },
                        unitCode: { $ifNull: ["$unitInfo.unitCode", ""] },
                        group: { $ifNull: ["$groupInfo.group", ""] },
                        groupCode: { $ifNull: ["$groupInfo.groupCode", ""] },
                        brand: { $ifNull: ["$brandInfo.brand", ""] },
                        brandCode: { $ifNull: ["$brandInfo.brandCode", ""] },
                        LP: { $ifNull: ["$LP", 0] },
                        HP: { $ifNull: ["$HP", ""] },
                        KW: { $ifNull: ["$KW", ""] },
                        discount: { $ifNull: ["$discount", ""] },
                        finalPrice: { $ifNull: ["$finalPrice", ""] },
                        productStage: { $ifNull: ["$productStage", ""] },
                        modelNo: { $ifNull: ["$modelNo", ""] },
                        suc_del: { $ifNull: ["$suc_del", ""] },
                    },
                },
                { $limit: 1 },
            ]).exec();
            if (!data) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return new response_product_dto_1.GetProductInfoDto(data[0]);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async UpdateProducts(id, updateProductDto) {
        try {
            const findItemCode = await this.productModel.find({ itemCode: updateProductDto.itemCode, _id: { $ne: id } });
            if (findItemCode.length > 0) {
                throw new common_1.BadRequestException("item code already exist");
            }
            return await this.productModel.findByIdAndUpdate(id, Object.assign({}, updateProductDto), { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async deleteProduct(id) {
        try {
            return await this.productModel.findByIdAndDelete(id);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateStatus(id, statusProductDto) {
        try {
            const findProduct = await this.productModel.findOne({ _id: ObjectId(statusProductDto.productid) });
            if (statusProductDto.active == false) {
                await this.cgInventoryModel.updateMany({ productId: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false });
                await this.cgOrderModel.updateMany({ productId: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false });
                await this.cgConsumptionModel.updateMany({ productId: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false });
                await this.roInventoryModel.updateMany({ productId: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false });
                await this.roOrderModel.updateMany({ productId: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false });
                await this.roConsumptionModel.updateMany({ productId: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false });
            }
            else if (statusProductDto.active == true) {
                const findCategory = await this.categoryModel.findOne({ categoryid: findProduct.categoryid, active: false });
                const findSubcategory = await this.subcategoryModel.findOne({ subcategoryid: findProduct.subcategoryid, active: false });
                if (findCategory) {
                    throw new common_1.BadRequestException("category is inactive");
                }
                if (findSubcategory) {
                    throw new common_1.BadRequestException("sub category is inactive");
                }
            }
            return await this.productModel.findByIdAndUpdate({ _id: ObjectId(statusProductDto.productid) }, { active: statusProductDto.active }, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async importProducts(createProductDto) {
        try {
            let errorArrray = [];
            const dataArray = Array.isArray(createProductDto) ? createProductDto : Object.values(createProductDto);
            const mappedArray = await Promise.all(dataArray.map(async (product) => {
                const existProduct = await this.productModel.findOne({ productName: product.productName });
                const existItem = await this.productModel.findOne({ itemCode: product.itemCode });
                const existSubCategory = await this.subcategoryModel.findOne({ subcategoryName: product.subcategoryName });
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
                checkBlank(product.productName, "productName is blank");
                checkBlank(product.subcategoryName, "subcategoryName is blank");
                if (!errString) {
                    let existGroup = null;
                    let existBrand = null;
                    let existUnit = null;
                    if (product.brand != "") {
                        let brand = await this.brandModel.findOne({ brand: product.brand });
                        if (brand) {
                            existBrand = brand._id;
                        }
                    }
                    if (product.group != "") {
                        let group = await this.groupModel.findOne({ group: product.group });
                        if (group) {
                            existGroup = group._id;
                        }
                    }
                    if (product.unit != "") {
                        let unit = await this.unitModel.findOne({ unit: product.unit });
                        if (unit) {
                            existUnit = unit._id;
                        }
                    }
                    if (existSubCategory && !existProduct) {
                        let finalPrice = product.LP;
                        if (product.discount) {
                            finalPrice = Number(product.LP) - Number((Number(product.discount) * Number(product.LP)) / 100);
                        }
                        else {
                            product.discount = 0;
                        }
                        await this.productModel.create(Object.assign(Object.assign({}, product), { finalPrice: finalPrice, discount: product.discount, brandid: existBrand, groupid: existGroup, unitid: existUnit, categoryid: existSubCategory.categoryid, subcategoryid: existSubCategory._id }));
                    }
                    else if (existSubCategory && existProduct !== null && existItem !== null) {
                        if (existProduct.productName === product.productName &&
                            existProduct.itemCode === product.itemCode) {
                            let LP = product.LP ? product.LP : existProduct.LP;
                            let finalPrice = LP;
                            let discount = product.discount ? product.discount : (existProduct.discount ? existProduct.discount : 0);
                            if (discount) {
                                finalPrice = Number(product.LP) - Number((Number(existProduct.discount) * Number(existProduct.LP)) / 100);
                            }
                            await this.productModel.findOneAndUpdate({ itemCode: product.itemCode }, {
                                $set: Object.assign(Object.assign({}, product), { finalPrice: finalPrice, discount: discount, brandid: existBrand, groupid: existGroup, unitid: existUnit }),
                            }, { new: true, setDefaultsOnInsert: false }).lean();
                        }
                    }
                    else {
                        if (existProduct !== null) {
                            if (existProduct.productName === product.productName) {
                                errString += " duplicate productName ,";
                            }
                        }
                        if (existItem !== null) {
                            if (existItem.itemCode === product.itemCode) {
                                errString += " duplicate itemCode ,";
                            }
                        }
                        checkExist(existSubCategory, "subCategory does not exist");
                    }
                }
                if (errString !== "") {
                    product["error"] = errString;
                    errorArrray.push(product);
                }
            }));
            return new response_product_dto_1.GetProductInfoDto({ mappedArray: mappedArray, errorArrray: errorArrray });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getProductDropDown(searchDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const data = await this.productModel.aggregate([
                { $match: { active: true } },
                {
                    $lookup: {
                        from: "silvercategories",
                        localField: "categoryid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, categoryName: 1 } }
                        ],
                        as: "categoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silversubcategories",
                        localField: "subcategoryid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, subcategoryName: 1 } }
                        ],
                        as: "subcategoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silverunits",
                        localField: "unitid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, unitCode: 1, unit: 1 } }
                        ],
                        as: "unitInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvergroups",
                        localField: "groupid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, groupCode: 1, group: 1 } }
                        ],
                        as: "groupInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silverbrands",
                        localField: "brandid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, brandCode: 1, brand: 1 } }
                        ],
                        as: "brandInfo",
                    },
                },
                { $unwind: { path: "$brandInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$groupInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$unitInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$subcategoryInfo", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        itemCode: { $ifNull: ["$itemCode", 0] },
                        itemDescription: { $ifNull: ["$itemDescription", ""] },
                        productName: { $ifNull: ["$productName", ""] },
                        categoryid: { $ifNull: ["$categoryid", ""] },
                        categoryName: { $ifNull: ["$categoryInfo.categoryName", ""] },
                        subcategoryid: { $ifNull: ["$subcategoryid", ""] },
                        subcategoryName: { $ifNull: ["$subcategoryInfo.subcategoryName", ""] },
                        active: { $ifNull: ["$active", false] },
                        moq: { $ifNull: ["$moq", ""] },
                        productPrice: { $ifNull: ["$productPrice", 0] },
                        weight: { $ifNull: ["$weight", 0] },
                        createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
                        manufactureLeadTime: { $ifNull: ["$manufactureLeadTime", 0] },
                        unit: { $ifNull: ["$unitInfo.unit", ""] },
                        unitid: { $ifNull: ["$unitInfo._id", ""] },
                        unitCode: { $ifNull: ["$unitInfo.unitCode", ""] },
                        group: { $ifNull: ["$groupInfo.group", ""] },
                        groupid: { $ifNull: ["$groupInfo._id", ""] },
                        groupCode: { $ifNull: ["$groupInfo.groupCode", ""] },
                        brand: { $ifNull: ["$brandInfo.brand", ""] },
                        brandid: { $ifNull: ["$brandInfo._id", ""] },
                        brandCode: { $ifNull: ["$brandInfo.brandCode", ""] },
                        LP: { $ifNull: ["$LP", 0] },
                        HP: { $ifNull: ["$HP", ""] },
                        KW: { $ifNull: ["$KW", ""] },
                        productStage: { $ifNull: ["$productStage", ""] },
                        modelNo: { $ifNull: ["$modelNo", ""] },
                        suc_del: { $ifNull: ["$suc_del", ""] },
                        discount: { $ifNull: ["$discount", ""] },
                        finalPrice: { $ifNull: ["$finalPrice", ""] },
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
SilverProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(silverProductMaster_1.SilverProduct.name)),
    __param(1, (0, mongoose_2.InjectModel)(silverCategory_entity_1.SilverCategory.name)),
    __param(2, (0, mongoose_2.InjectModel)(users_entity_1.User.name)),
    __param(3, (0, mongoose_2.InjectModel)(cgInventory_1.CgInventory.name)),
    __param(4, (0, mongoose_2.InjectModel)(roInventory_1.RoInventory.name)),
    __param(5, (0, mongoose_2.InjectModel)(cgOrder_1.CgOrder.name)),
    __param(6, (0, mongoose_2.InjectModel)(roOrder_1.RoOrder.name)),
    __param(7, (0, mongoose_2.InjectModel)(cgConsumption_1.CgConsumption.name)),
    __param(8, (0, mongoose_2.InjectModel)(roConsumption_1.RoConsumption.name)),
    __param(9, (0, mongoose_2.InjectModel)(silverSubCategory_1.SilverSubcategory.name)),
    __param(10, (0, mongoose_2.InjectModel)(silverBrand_entity_1.SilverBrand.name)),
    __param(11, (0, mongoose_2.InjectModel)(silverGroup_entity_1.SilverGroup.name)),
    __param(12, (0, mongoose_2.InjectModel)(silverUnit_entity_1.SilverUnit.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], SilverProductsService);
exports.SilverProductsService = SilverProductsService;
;
//# sourceMappingURL=product.service.js.map