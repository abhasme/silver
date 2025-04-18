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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CgInventoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;
const users_entity_1 = require("../../entities/users.entity");
const cgOrder_1 = require("../../entities/Silver/cgOrder");
const roMaster_1 = require("../../entities/Silver/roMaster");
const roInventory_1 = require("../../entities/Silver/roInventory");
const cgInventory_1 = require("../../entities/Silver/cgInventory");
const cgConsumption_1 = require("../../entities/Silver/cgConsumption");
const cggrowthFactorInfo_1 = require("../../entities/Silver/cggrowthFactorInfo");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const jwt_helper_1 = require("../../common/utils/jwt.helper");
const response_cgInventory_dto_1 = require("../../Silver/cg-inventory/dto/response-cgInventory.dto");
let CgInventoryService = class CgInventoryService {
    constructor(roInventoryModel, userModel, cgInventoryModel, cgConsumptionModel, silverProductModel, cgOrderModel, cgGrowthModel, roMasterModel) {
        this.roInventoryModel = roInventoryModel;
        this.userModel = userModel;
        this.cgInventoryModel = cgInventoryModel;
        this.cgConsumptionModel = cgConsumptionModel;
        this.silverProductModel = silverProductModel;
        this.cgOrderModel = cgOrderModel;
        this.cgGrowthModel = cgGrowthModel;
        this.roMasterModel = roMasterModel;
    }
    async UpdateCgInventory(togData, productId) {
        try {
            let date = await (0, jwt_helper_1.dateFormate)(new Date());
            let findInventory = await this.cgInventoryModel.findOne({
                productId: ObjectId(productId)
            });
            if (!findInventory) {
                throw new common_1.BadRequestException("Inventory not found");
            }
            let avgWeeklyConsumption;
            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "BLACK";
            let onHandStock = findInventory.onHandStock;
            let qualifiedDemand = findInventory.qualifiedDemand;
            const openOrder = await this.getOpenOrder(productId);
            let plantLeadTime = Number(findInventory.plantLeadTime);
            let tog = Number(togData);
            let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
            let moq = Number(findInventory.moq) ? Number(findInventory.moq) : 1;
            let tog_net = await Math.abs(Number(tog - netFlow));
            if (netFlow >= tog) {
                orderRecommendation = 0;
            }
            else if (tog_net < moq) {
                orderRecommendation = Number(moq);
            }
            else if (tog_net > moq) {
                orderRecommendation = Math.abs(moq * Math.round(Math.abs(tog_net / moq)));
            }
            let orderRecommendationStatus = 0;
            if (isNaN(orderRecommendation)) {
                orderRecommendationStatus = 0;
            }
            else {
                orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);
            }
            let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);
            if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                onHandStatus = 0;
            }
            else {
                onHandStatus = onHandStatusNumber;
            }
            flag = await (0, jwt_helper_1.flagFunction)(tog, onHandStock);
            let inventoryObject = {
                avgWeeklyConsumption: avgWeeklyConsumption,
                plantLeadTime: plantLeadTime,
                tog: tog,
                openOrder: openOrder,
                netFlow: Math.abs(netFlow),
                moq: moq,
                orderRecommendation: orderRecommendation,
                orderRecommendationStatus: orderRecommendationStatus,
                onHandStatus: onHandStatus,
                onHandStock: onHandStock,
                qualifiedDemand: qualifiedDemand,
                flag: flag
            };
            await this.cgInventoryModel.findByIdAndUpdate({ _id: findInventory._id }, Object.assign({}, inventoryObject), { new: true, useFindAndModify: false });
            if (orderRecommendation >= 0) {
                await this.cgOrderModel.deleteMany({ inventoryId: findInventory._id, "cg.stage": "PENDING" });
                const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                let order = new this.cgOrderModel({
                    createdBy: findInventory.createdBy,
                    qty: Number(orderRecommendation),
                    inventoryId: findInventory._id,
                    productId: findInventory.productId,
                    status: flag,
                    createdAt: date,
                    uniqueNumber: uniqueNumber,
                    "recommendation.qty": Number(orderRecommendation),
                    "cg.qty": Number(orderRecommendation),
                    "recommendation.createdAt": date,
                    "cg.createdAt": date,
                });
                order.save();
            }
            else if (orderRecommendation == 0) {
                await this.cgOrderModel.updateMany({ inventoryId: findInventory._id, "cg.stage": "PENDING" }, { active: false });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    ;
    async getAvgWeeklyConsumption(productId) {
        try {
            let avgWeeklyConsumption = 0;
            const currentDate = new Date();
            const thirteenWeeksAgo = new Date();
            thirteenWeeksAgo.setDate(currentDate.getDate() - 13 * 7);
            let checkConsumptionExit = await this.cgConsumptionModel.aggregate([{
                    $match: { date: { $lte: thirteenWeeksAgo }, productId: productId }
                },
            ]);
            if (checkConsumptionExit.length > 0) {
                let totalConsumption = await this.cgConsumptionModel.aggregate([
                    {
                        $match: {
                            productId: productId,
                            date: {
                                $gte: thirteenWeeksAgo,
                                $lte: currentDate,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalQty: { $sum: "$qty" },
                        },
                    },
                ]);
                if (totalConsumption.length > 0) {
                    avgWeeklyConsumption = (totalConsumption[0].totalQty) / 13;
                }
            }
            else {
                let findConsumption = await this.cgConsumptionModel.aggregate([
                    {
                        $match: { productId: productId }
                    },
                    {
                        $group: {
                            _id: null,
                            minDate: { $min: "$date" },
                            maxDate: { $max: new Date() },
                            totalQuality: { $sum: "$qty" }
                        }
                    },
                    {
                        $project: {
                            maxDate: new Date(),
                            minDate: "$minDate",
                            totalQuality: "$totalQuality",
                            weekDifference: {
                                $ceil: {
                                    $divide: [
                                        { $subtract: ["$maxDate", "$minDate"] },
                                        1000 * 60 * 60 * 24 * 7
                                    ]
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            totalQuality: "$totalQuality",
                            weekDifference1: {
                                $cond: {
                                    if: { $eq: ["$weekDifference", 0] },
                                    then: 1,
                                    else: "$weekDifference"
                                }
                            },
                        }
                    },
                    {
                        $project: {
                            avg: { $divide: ["$totalQuality", "$weekDifference1"] }
                        }
                    }
                ]);
                if (findConsumption.length > 0) {
                    avgWeeklyConsumption = findConsumption[0].avg;
                }
            }
            return avgWeeklyConsumption;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getAvgWeeklyConsumptionByInventory(inventoryId) {
        try {
            const findInventory = await this.cgInventoryModel.findOne({
                _id: inventoryId
            });
            let avgWeeklyConsumption = 0;
            const currentDate = new Date();
            const thirteenWeeksAgo = new Date();
            thirteenWeeksAgo.setDate(currentDate.getDate() - 13 * 7);
            let checkConsumptionExit = await this.cgConsumptionModel.aggregate([{
                    $match: { date: { $lte: thirteenWeeksAgo }, productId: findInventory.productId }
                },
            ]);
            if (checkConsumptionExit.length > 0) {
                let totalConsumption = await this.cgConsumptionModel.aggregate([
                    {
                        $match: {
                            productId: findInventory.productId,
                            date: {
                                $gte: thirteenWeeksAgo,
                                $lte: currentDate,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalQty: { $sum: "$qty" },
                        },
                    },
                ]);
                if (totalConsumption.length > 0) {
                    avgWeeklyConsumption = (totalConsumption[0].totalQty) / 13;
                }
            }
            else {
                let findConsumption = await this.cgConsumptionModel.aggregate([
                    {
                        $match: { productId: findInventory.productId }
                    },
                    {
                        $group: {
                            _id: null,
                            minDate: { $min: "$date" },
                            maxDate: { $max: new Date() },
                            totalQuality: { $sum: "$qty" }
                        }
                    },
                    {
                        $project: {
                            maxDate: new Date(),
                            minDate: "$minDate",
                            totalQuality: "$totalQuality",
                            weekDifference: {
                                $ceil: {
                                    $divide: [
                                        1000 * 60 * 60 * 24 * 7
                                    ]
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            totalQuality: "$totalQuality",
                            weekDifference1: {
                                $cond: {
                                    if: { $eq: ["$weekDifference", 0] },
                                    then: 1,
                                    else: "$weekDifference"
                                }
                            },
                        }
                    },
                    {
                        $project: {
                            avg: { $divide: ["$totalQuality", "$weekDifference1"] }
                        }
                    }
                ]);
                if (findConsumption.length > 0) {
                    avgWeeklyConsumption = findConsumption[0].avg;
                }
            }
            return avgWeeklyConsumption;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async generateUniqueNumber() {
        try {
            let randomNumber = Math.floor(Math.random() * (1000 - 400)) + 400;
            return `${randomNumber}`;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async changeUniqueNumber() {
        var _a, e_1, _b, _c;
        try {
            let documentsToUpdate = await this.cgOrderModel.find({ "cg.status": true, "cg.stage": "PENDING", uniqueNumber: 1 });
            try {
                for (var _d = true, documentsToUpdate_1 = __asyncValues(documentsToUpdate), documentsToUpdate_1_1; documentsToUpdate_1_1 = await documentsToUpdate_1.next(), _a = documentsToUpdate_1_1.done, !_a;) {
                    _c = documentsToUpdate_1_1.value;
                    _d = false;
                    try {
                        const document = _c;
                        const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                        let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                        await this.cgOrderModel.findByIdAndUpdate(document._id, { $set: { uniqueNumber: uniqueNumber } }, { new: true });
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = documentsToUpdate_1.return)) await _b.call(documentsToUpdate_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    ;
    async cgInventoryInfo(productId) {
        try {
            const inventory = await this.roInventoryModel.aggregate([
                {
                    $match: { productId: ObjectId(productId) }
                },
                {
                    $lookup: {
                        from: "romasters",
                        localField: "roId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, roName: 1 } }
                        ],
                        as: "roInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, itemCode: 1, productName: 1, } }
                        ],
                        as: "productInfo",
                    },
                },
                { $unwind: { path: "$roInfo", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        tog: { $ifNull: ["$tog", 0] },
                        oldTog: { $ifNull: ["$oldTog", 0] },
                        togRecommendation: { $ifNull: ["$togRecommendation", 0] },
                        growthFactor: { $ifNull: ["$growthFactor", "0"] },
                        roName: { $ifNull: ["$roInfo.roName", ""] },
                        productName: { $ifNull: ["$productInfo.productName", ""] },
                        itemCode: { $ifNull: ["$productInfo.itemCode", 0] },
                        isUpdateGrowthFactor: { $ifNull: ["$isUpdateGrowthFactor", false] },
                    }
                },
            ]);
            if (inventory.length > 0) {
                inventory.sort((a, b) => b.orderNumber - a.orderNumber);
            }
            return inventory;
        }
        catch (error) {
            return [];
        }
    }
    ;
    async getOpenOrder(productId) {
        try {
            const result = await this.cgOrderModel.aggregate([
                {
                    $match: {
                        active: true,
                        $and: [
                            {
                                productId: ObjectId(productId)
                            },
                            {
                                $and: [{ "cg.stage": "ACCEPT" }, { "wip.stage": "PENDING" },]
                            }
                        ]
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalQuantity: { $sum: '$qty' }
                    }
                }
            ]);
            const openOrder = result.length > 0 ? result[0].totalQuantity : 0;
            return openOrder;
        }
        catch (error) {
            return 0;
        }
    }
    ;
    async createInventory(createInventoryDto, req) {
        try {
            let date = await (0, jwt_helper_1.dateFormate)(new Date());
            const findInventory = await this.cgInventoryModel.findOne({ productId: ObjectId(createInventoryDto.productId) });
            if (findInventory) {
                throw new common_1.BadRequestException("Inventory already exist");
            }
            let avgWeeklyConsumption = 0;
            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "BLACK";
            let onHandStock = createInventoryDto.onHandStock;
            let qualifiedDemand = createInventoryDto.qualifiedDemand;
            const openOrder = await this.getOpenOrder(createInventoryDto.productId);
            let tog = Number(createInventoryDto.tog);
            let netFlow = Number(createInventoryDto.onHandStock + openOrder - qualifiedDemand);
            let moq = Number(createInventoryDto.moq) ? Number(createInventoryDto.moq) : 1;
            let tog_net = await Math.abs(Number(tog - netFlow));
            if (netFlow >= tog) {
                orderRecommendation = 0;
            }
            else if (tog_net < moq) {
                orderRecommendation = Number(moq);
            }
            else if (tog_net > moq) {
                orderRecommendation = Math.abs(Math.abs(moq * Math.round(Math.abs(tog_net / moq))));
            }
            let orderRecommendationStatus = 0;
            if (isNaN(orderRecommendation)) {
                orderRecommendationStatus = 0;
            }
            else {
                orderRecommendationStatus = Number(orderRecommendation) * 100 / tog;
            }
            let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);
            if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                onHandStatus = 0;
            }
            else {
                onHandStatus = onHandStatusNumber;
            }
            flag = await (0, jwt_helper_1.flagFunction)(tog, onHandStock);
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            let inventoryObject = {
                productId: createInventoryDto.productId,
                createdBy: authInfo._id,
                avgWeeklyConsumption: avgWeeklyConsumption,
                plantLeadTime: createInventoryDto.plantLeadTime,
                growthFactor: createInventoryDto.growthFactor,
                tog: tog,
                openOrder: openOrder,
                netFlow: Math.abs(netFlow),
                moq: moq,
                orderRecommendation: orderRecommendation,
                orderRecommendationStatus: orderRecommendationStatus,
                onHandStatus: onHandStatus,
                flag: flag,
                onHandStock: onHandStock,
                qualifiedDemand: qualifiedDemand
            };
            const inventory = new this.cgInventoryModel(inventoryObject);
            if (await inventory.save()) {
                if (orderRecommendation > 0) {
                    const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                    let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                    let order = new this.cgOrderModel(Object.assign(Object.assign({}, createInventoryDto), { createdBy: authInfo._id, qty: Number(orderRecommendation), inventoryId: inventory.id, productId: createInventoryDto.productId, status: flag, createdAt: date, uniqueNumber: uniqueNumber, "recommendation.qty": Number(orderRecommendation), "cg.qty": Number(orderRecommendation), "recommendation.createdAt": date, "cg.createdAt": date }));
                    order.save();
                }
                return new response_cgInventory_dto_1.GetCgInventoryInfoDto(inventory);
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getAllInventory(paginationDto, req) {
        var _a, e_2, _b, _c;
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const orderByFields = paginationDto.orderBy || ["createdAt"];
            let sortFields = {};
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
            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false };
            }
            ;
            const status = paginationDto.status ? { flag: paginationDto.status } : {};
            const filter = await (0, jwt_helper_1.multiSelectorFunction)(paginationDto);
            const inventory = await this.cgInventoryModel.aggregate([
                {
                    $match: status
                },
                {
                    $match: activeCondition
                },
                {
                    $lookup: {
                        from: "roconsumptions",
                        let: { productId: "$productId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $and: [{ $eq: ["$productId", "$$productId"] }] }
                                }
                            },
                            {
                                $project: {
                                    qty: 1,
                                }
                            }
                        ],
                        as: "consumptionInfo"
                    }
                },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, moq: 1, unitid: 1, itemCode: 1, itemDescription: 1, productName: 1, categoryid: 1, subcategoryid: 1, finalPrice: 1, groupid: 1 } }
                        ],
                        as: "productInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvercategories",
                        localField: "productInfo.categoryid",
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
                        localField: "productInfo.subcategoryid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, subcategoryName: 1 } }
                        ],
                        as: "subcategoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "roinventories",
                        localField: "roInventoryId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, productId: 1, roId: 1, oldTog: 1, tog: 1, growthFactor: 1, togRecommendation: 1 } }
                        ],
                        as: "roInventoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvergroups",
                        localField: "productInfo.groupid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, group: 1, groupCode: 1 } }],
                        as: "groupInfo",
                    },
                },
                {
                    $project: {
                        group: { $ifNull: [{ $first: "$groupInfo.group" }, ""] },
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        tog: { $ifNull: [{ $floor: "$tog" }, 0] },
                        avgWeeklyConsumption: { $ifNull: [{ $floor: "$avgWeeklyConsumption" }, 0] },
                        leadTime: { $ifNull: ["$leadTime", 0] },
                        roSigma: { $ifNull: ["$roSigma", 0] },
                        moq: { $ifNull: ["$moq", 1] },
                        plantLeadTime: { $ifNull: ["$plantLeadTime", 0] },
                        growthFactor: { $ifNull: ["$growthFactor", ""] },
                        togRecommendation: { $ifNull: ["$togRecommendation", 0] },
                        onHandStock: { $ifNull: ["$onHandStock", 0] },
                        qualifiedDemand: { $ifNull: ["$qualifiedDemand", 0] },
                        orderRecommendation: { $ifNull: ["$orderRecommendation", 0] },
                        orderRecommendationStatus: {
                            $cond: {
                                if: { $or: [{ $eq: ["$orderRecommendationStatus", "NaN"] }, { $eq: ["$orderRecommendationStatus", "Infinity"] }] },
                                then: "0",
                                else: "$orderRecommendationStatus"
                            }
                        },
                        onHandStatus: { $ifNull: ["$onHandStatus", ""] },
                        flag: { $ifNull: ["$flag", ""] },
                        consumption: { $ifNull: ["$consumption", 0] },
                        netFlow: { $ifNull: ["$netFlow", 0] },
                        openOrder: { $ifNull: ["$openOrder", 0] },
                        active: { $ifNull: ["$active", true] },
                        isUpdateTog: { $ifNull: ["$isUpdateTog", false] },
                        isConvertFinalToTog: { $ifNull: ["$isConvertFinalToTog", false] },
                        isGrowthFactor: { $ifNull: ["$isGrowthFactor", false] },
                        createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        avg: { $ifNull: [{ $floor: "$rWC" }, 0] },
                        togValue: {
                            $ifNull: [
                                {
                                    $multiply: [
                                        { $ifNull: [{ $toDouble: { $floor: "$tog" } }, 1] },
                                        { $ifNull: [{ $toDouble: { $first: "$productInfo.finalPrice" } }, 1] }
                                    ]
                                },
                                1
                            ]
                        },
                        stockValue: {
                            $ifNull: [
                                {
                                    $multiply: [
                                        { $ifNull: [{ $toDouble: "$onHandStock" }, 1] },
                                        { $ifNull: [{ $toDouble: { $first: "$productInfo.finalPrice" } }, 1] }
                                    ]
                                },
                                1
                            ]
                        },
                        prValue: {
                            $ifNull: [
                                {
                                    $multiply: [
                                        { $ifNull: [{ $toDouble: "$orderRecommendation" }, 1] },
                                        { $ifNull: [{ $toDouble: { $first: "$productInfo.finalPrice" } }, 1] }
                                    ]
                                },
                                1
                            ]
                        }
                    }
                },
                {
                    $match: {
                        $or: [
                            { itemCode: { $regex: paginationDto.search, '$options': 'i' } },
                            { moq: { $regex: paginationDto.search, '$options': 'i' } },
                            { contactPersonName: { $regex: paginationDto.search, '$options': 'i' } },
                            { roName: { $regex: paginationDto.search, '$options': 'i' } },
                            { productName: { $regex: paginationDto.search, '$options': 'i' } },
                            { categoryName: { $regex: paginationDto.search, '$options': 'i' } },
                            { onHandStatus: { $regex: paginationDto.search, '$options': 'i' } },
                            { flag: { $regex: paginationDto.search, '$options': 'i' } },
                            { itemDescription: { $regex: paginationDto.search, '$options': 'i' } },
                            { itemDescription: { $eq: paginationDto.search } },
                            { city: { $regex: paginationDto.search, '$options': 'i' } },
                            { orderRecommendationStatus: { $regex: paginationDto.search, '$options': 'i' } },
                            { state: { $regex: paginationDto.search, '$options': 'i' } },
                            { tog: { $eq: parseInt(paginationDto.search) } },
                            { avgWeeklyConsumption: { $eq: parseInt(paginationDto.search) } },
                            { leadTime: { $eq: parseInt(paginationDto.search) } },
                            { onHandStock: { $eq: parseInt(paginationDto.search) } },
                            { qualifiedDemand: { $eq: parseInt(paginationDto.search) } },
                            { orderRecommendation: { $eq: parseInt(paginationDto.search) } },
                            { netFlow: { $eq: parseInt(paginationDto.search) } },
                            { openOrder: { $eq: parseInt(paginationDto.search) } },
                            { consumption: { $eq: parseInt(paginationDto.search) } },
                            { avg: { $eq: parseInt(paginationDto.search) } },
                            { growthFactor: { $eq: parseInt(paginationDto.search) } },
                            { createdAt: { $regex: paginationDto.search, $options: "i" }, },
                        ]
                    }
                },
                {
                    $match: filter
                },
                { $sort: { ["onHandStatus"]: 1 } },
                {
                    $addFields: {
                        customOrder: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$flag", "BLACK"] }, then: 1 },
                                    { case: { $eq: ["$flag", "RED"] }, then: 2 },
                                    { case: { $eq: ["$flag", "YELLOW"] }, then: 3 },
                                    { case: { $eq: ["$flag", "GREEN"] }, then: 4 },
                                    { case: { $eq: ["$flag", "WHIGHT"] }, then: 5 },
                                ],
                            },
                        },
                    },
                },
                { $sort: { customOrder: 1 }, },
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
            if (!inventory || !inventory[0]) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            try {
                for (var _d = true, _e = __asyncValues(inventory[0].docs), _f; _f = await _e.next(), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        let data = _c;
                        data["growthFactorInfo"] = await this.cgInventoryInfo(data.productId);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return inventory;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getInventoryInfo(id) {
        try {
            const inventory = await this.cgInventoryModel.aggregate([
                {
                    $match: { active: true, _id: ObjectId(id) }
                },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, moq: 1, unitid: 1, itemCode: 1, itemDescription: 1, productName: 1, categoryid: 1, subcategoryid: 1 } }
                        ],
                        as: "productInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvercategories",
                        localField: "productInfo.categoryid",
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
                        localField: "productInfo.subcategoryid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, subcategoryName: 1 } }
                        ],
                        as: "subcategoryInfo",
                    },
                },
                {
                    $project: {
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        roSigma: { $ifNull: ["$roSigma", 0] },
                        plantLeadTime: { $ifNull: ["$plantLeadTime", 0] },
                        togRecommendation: { $ifNull: ["$togRecommendation", 0] },
                        tog: { $ifNull: [{ $floor: "$tog" }, 0] },
                        avgWeeklyConsumption: { $ifNull: ["$avgWeeklyConsumption", 0] },
                        onHandStock: { $ifNull: ["$onHandStock", 0] },
                        qualifiedDemand: { $ifNull: ["$qualifiedDemand", 0] },
                        orderRecommendation: { $ifNull: ["$orderRecommendation", 0] },
                        orderRecommendationStatus: { $ifNull: ["$orderRecommendationStatus", ""] },
                        onHandStatus: { $ifNull: ["$onHandStatus", ""] },
                        flag: { $ifNull: ["$flag", ""] },
                        consumption: { $ifNull: ["$consumption", 0] },
                        netFlow: { $ifNull: ["$netFlow", 0] },
                        openOrder: { $ifNull: ["$openOrder", 0] },
                        moq: { $ifNull: ["$moq", 0] },
                        active: { $ifNull: ["$active", true] },
                        isUpdateTog: { $ifNull: ["$isUpdateTog", false] },
                        growthFactor: { $ifNull: ["$growthFactor", ""] },
                    }
                },
            ]).exec();
            if (!inventory || !inventory[0]) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return inventory[0];
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateInventoryStatus(id, updateStatusInventoryDto) {
        try {
            let findInventory = await this.cgInventoryModel.findOne({
                _id: ObjectId(id)
            });
            if (!findInventory) {
                throw new common_1.BadRequestException("inventory not exit ");
            }
            if (updateStatusInventoryDto.active === false) {
                await this.cgOrderModel.updateMany({ inventoryId: ObjectId(id) }, { active: updateStatusInventoryDto.active }, { new: true, useFindAndModify: false });
                await this.cgConsumptionModel.updateMany({ _id: ObjectId(id) }, { active: updateStatusInventoryDto.active }, { new: true, useFindAndModify: false });
            }
            else {
                const findProduct = await this.silverProductModel.findOne({ _id: findInventory.productId, active: false });
                const findChannelPartner = await this.roMasterModel.findOne({ isActive: false });
                if (findProduct && findProduct != null) {
                    throw new common_1.BadRequestException("product is inactive");
                }
                if (findChannelPartner && findChannelPartner != null) {
                    throw new common_1.BadRequestException("channel partner is inactive");
                }
            }
            return await this.cgInventoryModel.findByIdAndUpdate(findInventory._id, { active: updateStatusInventoryDto.active }, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async UpdateInventory(id, updateInventoryDto, req) {
        try {
            let date = await (0, jwt_helper_1.dateFormate)(new Date());
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            let findInventory = await this.cgInventoryModel.findOne({
                productId: ObjectId(updateInventoryDto.productId)
            });
            if (!findInventory) {
                throw new common_1.BadRequestException("Inventory not found");
            }
            let avgWeeklyConsumption;
            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "BLACK";
            let onHandStock = updateInventoryDto.onHandStock;
            let qualifiedDemand = updateInventoryDto.qualifiedDemand;
            const openOrder = await this.getOpenOrder(updateInventoryDto.productId);
            let plantLeadTime = Number(updateInventoryDto.plantLeadTime) ? Number(updateInventoryDto.plantLeadTime) : Number(findInventory.plantLeadTime);
            let tog = !isNaN(Number(updateInventoryDto.tog)) && updateInventoryDto.tog !== null ? Number(updateInventoryDto.tog) : findInventory.tog;
            let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
            let moq = Number(updateInventoryDto.moq) ? Number(updateInventoryDto.moq) : 1;
            let tog_net = await Math.abs(Number(tog - netFlow));
            if (netFlow >= tog) {
                orderRecommendation = 0;
            }
            else if (tog_net < moq) {
                orderRecommendation = Number(moq);
            }
            else if (tog_net > moq) {
                orderRecommendation = Math.abs(moq * Math.round(Math.abs(tog_net / moq)));
            }
            let orderRecommendationStatus = 0;
            if (isNaN(orderRecommendation)) {
                orderRecommendationStatus = 0;
            }
            else {
                orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);
            }
            let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);
            if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                onHandStatus = 0;
            }
            else {
                onHandStatus = onHandStatusNumber;
            }
            flag = await (0, jwt_helper_1.flagFunction)(tog, onHandStock);
            let inventoryObject = {
                createdBy: authInfo._id,
                avgWeeklyConsumption: avgWeeklyConsumption,
                plantLeadTime: plantLeadTime,
                growthFactor: updateInventoryDto.growthFactor ? updateInventoryDto.growthFactor : findInventory.growthFactor,
                tog: tog,
                openOrder: openOrder,
                netFlow: Math.abs(netFlow),
                moq: moq,
                orderRecommendation: orderRecommendation,
                orderRecommendationStatus: orderRecommendationStatus,
                onHandStatus: onHandStatus,
                onHandStock: onHandStock,
                qualifiedDemand: qualifiedDemand,
                flag: flag
            };
            await this.cgInventoryModel.findByIdAndUpdate({ _id: findInventory._id }, Object.assign({}, inventoryObject), { new: true, useFindAndModify: false });
            if (orderRecommendation >= 0) {
                await this.cgOrderModel.deleteMany({ inventoryId: findInventory._id, "cg.stage": "PENDING" });
                const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                let order = new this.cgOrderModel(Object.assign(Object.assign({}, updateInventoryDto), { createdBy: authInfo._id, qty: Number(orderRecommendation), inventoryId: findInventory._id, productId: findInventory.productId, status: flag, createdAt: date, uniqueNumber: uniqueNumber, "recommendation.qty": Number(orderRecommendation), "cg.qty": Number(orderRecommendation), "recommendation.createdAt": date, "cg.createdAt": date }));
                order.save();
            }
            else if (orderRecommendation == 0) {
                await this.cgOrderModel.updateMany({ inventoryId: findInventory._id, "cg.stage": "PENDING" }, { active: false });
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getDashBoardInventoryInfo(GetDashBoardCgInventoryInfo, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            let condition = {};
            let activeCondition = { active: true };
            if (GetDashBoardCgInventoryInfo.active == false) {
                activeCondition = { active: false };
            }
            const inventoyallCount = await this.cgInventoryModel.countDocuments({
                $and: [condition, activeCondition]
            });
            const inventory = await this.cgInventoryModel.aggregate([
                {
                    $match: condition
                },
                {
                    $match: activeCondition
                },
                {
                    '$group': {
                        '_id': '$flag',
                        'count': {
                            '$sum': 1
                        }
                    }
                },
                {
                    '$project': {
                        '_id': 0,
                        'flag': '$_id',
                        'count': 1
                    }
                }
            ]);
            inventory.push({ "count": inventoyallCount, "flag": "all" });
            return inventory;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getInventoryDropDown(req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const inventory = await this.cgInventoryModel.aggregate([
                {
                    $match: { active: true },
                },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    moq: 1,
                                    itemCode: 1,
                                    itemDescription: 1,
                                    productName: 1,
                                    categoryid: 1,
                                    subcategoryid: 1,
                                    unitid: 1,
                                },
                            },
                        ],
                        as: "productInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvercategories",
                        localField: "productInfo.categoryid",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: { _id: 1, categoryName: 1 },
                            },
                        ],
                        as: "categoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silversubcategories",
                        localField: "productInfo.subcategoryid",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: { _id: 1, subcategoryName: 1 },
                            },
                        ],
                        as: "subcategoryInfo",
                    },
                },
                {
                    $project: {
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, ""] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        tog: { $ifNull: [{ $floor: "$tog" }, 0] },
                        avgWeeklyConsumption: { $ifNull: [{ $floor: "$avgWeeklyConsumption" }, 0] },
                        leadTime: { $ifNull: ["$leadTime", 0] },
                        onHandStock: { $ifNull: ["$onHandStock", 0] },
                        qualifiedDemand: { $ifNull: ["$qualifiedDemand", 0] },
                        orderRecommendation: { $ifNull: ["$orderRecommendation", 0] },
                        orderRecommendationStatus: { $ifNull: ["$orderRecommendationStatus", ""] },
                        onHandStatus: { $ifNull: ["$onHandStatus", ""] },
                        flag: { $ifNull: ["$flag", ""] },
                        consumption: { $ifNull: ["$consumption", 0] },
                        netFlow: { $ifNull: ["$netFlow", 0] },
                        openOrder: { $ifNull: ["$openOrder", 0] },
                        active: { $ifNull: ["$active", true] },
                        avg: { $ifNull: [{ $floor: "$rWC" }, 0] },
                        roSigma: { $ifNull: ["$roSigma", 0] },
                        growthFactor: { $ifNull: ["$growthFactor", ""] },
                        plantLeadTime: { $ifNull: ["$plantLeadTime", 0] },
                        togRecommendation: { $ifNull: ["$togRecommendation", 0] },
                        group: { $ifNull: ["$categoryName", 0] },
                        moq: { $ifNull: ["$moq", 1] },
                    },
                },
            ]).exec();
            if (!inventory) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return inventory;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async importInventory(createInventoryDto, req) {
        try {
            let date = await (0, jwt_helper_1.dateFormate)(new Date());
            let errorArrray = [];
            const dataArray = Array.isArray(createInventoryDto) ? createInventoryDto : Object.values(createInventoryDto);
            const mappedArray = await Promise.all(dataArray.map(async (inventory) => {
                const existProduct = await this.silverProductModel.findOne({ productName: inventory.productName });
                let existInventory = null;
                if (existProduct) {
                    existInventory = await this.cgInventoryModel.findOne({ productId: existProduct._id });
                }
                else {
                    existInventory = null;
                }
                let errString = "";
                const checkInMto = (property, errorMessage) => {
                    if (property === null) {
                        errString += `${errorMessage} ,`;
                    }
                };
                const checkExist = (property, errorMessage) => {
                    if (!property) {
                        errString += `${errorMessage} ,`;
                    }
                };
                const checkNumber = (property, errorMessage) => {
                    if (typeof property !== 'number') {
                        errString += `${errorMessage} ,`;
                    }
                };
                if (!errString) {
                    if (existProduct && !existInventory) {
                        let avgWeeklyConsumption = 0;
                        let orderRecommendation = 0;
                        let onHandStatus = 0;
                        let flag = "BLACK";
                        let onHandStock = inventory.onHandStock ? inventory.onHandStock : 0;
                        let qualifiedDemand = inventory.qualifiedDemand ? inventory.qualifiedDemand : 0;
                        const findConsumption = await this.cgConsumptionModel.findOne({
                            productId: ObjectId(existProduct._id)
                        });
                        if (findConsumption) {
                            onHandStock = Math.abs(findConsumption.qty - Number(onHandStock));
                            qualifiedDemand = Math.abs(findConsumption.qty - Number(qualifiedDemand));
                        }
                        const openOrder = await this.getOpenOrder(existProduct._id);
                        avgWeeklyConsumption = await this.getAvgWeeklyConsumption(existProduct._id);
                        let findLeadTime = 0;
                        let leadTime = inventory.leadTime ? Number(inventory.leadTime) : Number(findLeadTime);
                        let product = await this.silverProductModel.findOne({ _id: existProduct._id });
                        let tog = Number(inventory.tog) ? Number(inventory.tog) : await Number(avgWeeklyConsumption * leadTime);
                        let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
                        let moq = Number(inventory.moq) ? Number(inventory.moq) : 1;
                        let tog_net = await Math.abs(Number(tog - netFlow));
                        if (netFlow >= tog) {
                            orderRecommendation = 0;
                        }
                        else if (tog_net < moq) {
                            orderRecommendation = Number(moq);
                        }
                        else if (tog_net > moq) {
                            orderRecommendation = Math.abs(moq * Math.round(Math.abs(tog_net / moq)));
                        }
                        let orderRecommendationStatus = 0;
                        if (isNaN(orderRecommendation)) {
                            orderRecommendationStatus = 0;
                        }
                        else {
                            orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);
                        }
                        let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);
                        if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                            onHandStatus = 0;
                        }
                        else {
                            onHandStatus = onHandStatusNumber;
                        }
                        flag = await (0, jwt_helper_1.flagFunction)(tog, onHandStock);
                        const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
                        let inventoryObject = {
                            productId: existProduct._id,
                            createdBy: authInfo._id,
                            avgWeeklyConsumption: avgWeeklyConsumption,
                            leadTime: leadTime,
                            growthFactor: inventory.growthFactor,
                            tog: tog,
                            openOrder: openOrder,
                            netFlow: Math.abs(netFlow),
                            moq: moq,
                            orderRecommendation: orderRecommendation,
                            orderRecommendationStatus: orderRecommendationStatus,
                            onHandStatus: onHandStatus,
                            flag: flag,
                            onHandStock: onHandStock,
                            qualifiedDemand: qualifiedDemand
                        };
                        let inventorys = new this.cgInventoryModel(inventoryObject);
                        if (await inventorys.save()) {
                            if (orderRecommendation > 0) {
                                let order = new this.cgOrderModel(Object.assign(Object.assign({}, createInventoryDto), { createdBy: authInfo._id, productId: existProduct._id, qty: Number(orderRecommendation), inventoryId: inventorys._id, status: flag, createdAt: date, "recommendation.qty": Number(orderRecommendation), "cg.qty": Number(orderRecommendation), "recommendation.createdAt": date, "cg.createdAt": date }));
                                order.save();
                            }
                            return new response_cgInventory_dto_1.GetCgInventoryInfoDto(inventorys);
                        }
                    }
                    else if (existProduct && existInventory !== null) {
                        let avgWeeklyConsumption = 0;
                        let orderRecommendation = 0;
                        let onHandStatus = 0;
                        let flag = "BLACK";
                        let onHandStock = inventory.onHandStock ? Number(inventory.onHandStock) : Number(existInventory.onHandStock);
                        let qualifiedDemand = inventory.qualifiedDemand ? Number(inventory.qualifiedDemand) : Number(existInventory.qualifiedDemand);
                        let leadTime = inventory.leadTime ? Number(inventory.leadTime) : Number(existInventory.plantLeadTime);
                        const findConsumption = await this.cgConsumptionModel.findOne({
                            productId: ObjectId(existProduct._id)
                        });
                        const openOrder = await this.getOpenOrder(existProduct._id);
                        avgWeeklyConsumption = await this.getAvgWeeklyConsumption(existProduct._id);
                        let product = await this.silverProductModel.findOne({ _id: existProduct._id });
                        let tog = Number(inventory.tog) ? Number(inventory.tog) : existInventory.tog;
                        let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
                        let moq = Number(inventory.moq) ? Number(inventory.moq) : 1;
                        let tog_net = await Math.abs(Number(tog - netFlow));
                        if (netFlow >= tog) {
                            orderRecommendation = 0;
                        }
                        else if (tog_net < moq) {
                            orderRecommendation = Number(moq);
                        }
                        else if (tog_net > moq) {
                            orderRecommendation = Math.abs(moq * Math.round(Math.abs(tog_net / moq)));
                        }
                        let orderRecommendationStatus = 0;
                        if (isNaN(orderRecommendation)) {
                            orderRecommendationStatus = 0;
                        }
                        else {
                            orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);
                        }
                        let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);
                        if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                            onHandStatus = 0;
                        }
                        else {
                            onHandStatus = onHandStatusNumber;
                        }
                        flag = await (0, jwt_helper_1.flagFunction)(tog, onHandStock);
                        const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
                        let inventoryObject = {
                            productId: existProduct._id,
                            createdBy: authInfo._id,
                            avgWeeklyConsumption: avgWeeklyConsumption,
                            plantLeadTime: leadTime,
                            growthFactor: existInventory.growthFactor ? existInventory.growthFactor : "1",
                            tog: tog,
                            openOrder: openOrder,
                            netFlow: Math.abs(netFlow),
                            moq: moq,
                            orderRecommendation: orderRecommendation,
                            orderRecommendationStatus: orderRecommendationStatus,
                            onHandStatus: onHandStatus,
                            flag: flag,
                            onHandStock: onHandStock,
                            qualifiedDemand: qualifiedDemand
                        };
                        await this.cgInventoryModel.findByIdAndUpdate({ _id: existInventory._id }, Object.assign({}, inventoryObject), { new: true, setDefaultsOnInsert: false }).lean();
                        if (orderRecommendation > 0) {
                            await this.cgOrderModel.deleteMany({ inventoryId: existInventory._id, "cg.stage": "PENDING" });
                            let order = new this.cgOrderModel(Object.assign(Object.assign({}, createInventoryDto), { createdBy: authInfo._id, qty: Number(orderRecommendation), inventoryId: existInventory._id, productId: existProduct._id, status: flag, createdAt: date, "recommendation.qty": Number(orderRecommendation), "cg.qty": Number(orderRecommendation), "recommendation.createdAt": date, "cg.createdAt": date }));
                            order.save();
                        }
                    }
                    else {
                        await checkNumber(inventory.tog, "tog should be number");
                        await checkNumber(inventory.onHandStock, "onHandStock should be number");
                        await checkNumber(inventory.qualifiedDemand, "qualifiedDemand should be number");
                        await checkExist(existProduct, "product does not exist");
                    }
                }
                if (errString !== "") {
                    inventory["error"] = errString;
                    errorArrray.push(inventory);
                }
            }));
            await this.changeUniqueNumber();
            setTimeout(async function () {
                await this.changeUniqueNumber();
                console.log("Inside setTimeout function");
            }.bind(this), 10000);
            return new response_cgInventory_dto_1.GetCgInventoryInfoDto({ mappedArray: mappedArray, errorArrray: errorArrray });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getInventoryMoreInfo(viewOtherInventoryDto) {
        try {
            const inventory = await this.cgInventoryModel.aggregate([
                {
                    $match: {
                        active: true,
                    }
                },
                {
                    $project: {
                        qualifiedDemand: { $ifNull: ["$qualifiedDemand", 0] },
                        onHandStock: { $ifNull: ["$onHandStock", 0] },
                        tog: { $ifNull: [{ $floor: "$tog" }, 0] },
                    }
                },
            ]).exec();
            if (!inventory || !inventory[0]) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return inventory[0];
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getProductDropDown(searchDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const data = await this.silverProductModel.aggregate([
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
                        roSigma: { $ifNull: ["$roSigma", 0] },
                        plantLeadTime: { $ifNull: ["$plantLeadTime", 0] },
                        togRecommendation: { $ifNull: ["$togRecommendation", 0] },
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
    async UpdateTogToggle(id, updateTogToggleDto, req) {
        try {
            let date = await (0, jwt_helper_1.dateFormate)(new Date());
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            let findInventory = await this.cgInventoryModel.findOne({ _id: ObjectId(id) });
            if (!findInventory) {
                throw new common_1.BadRequestException("Inventory not found");
            }
            await this.cgInventoryModel.findByIdAndUpdate({ _id: findInventory._id }, { isUpdateTog: updateTogToggleDto.isUpdateTog }, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async changeTog(id, changeTogDto) {
        try {
            let findInventory = await this.cgInventoryModel.findOne({ _id: ObjectId(id) });
            if (!findInventory) {
                throw new common_1.BadRequestException("inventory not exit ");
            }
            let tog;
            if (changeTogDto.isConvertFinalToTog == true) {
                await this.UpdateCgInventory(findInventory.togRecommendation, findInventory.productId);
                await this.cgGrowthModel.updateMany({ cgInventoryId: ObjectId(id) }, { isUpdateGrowthFactor: false });
                return await this.cgInventoryModel.findByIdAndUpdate(findInventory._id, { oldTogRecommendation: tog, tog: tog, growthFactor: 1, isConvertFinalToTog: false }, { new: true, useFindAndModify: false });
            }
            else if (changeTogDto.isUpdateTog) {
                await this.UpdateCgInventory(changeTogDto.tog, findInventory.productId);
                tog = changeTogDto.tog;
            }
            else if (changeTogDto.isNoTogChange) {
                tog = findInventory.tog;
            }
            return await this.cgInventoryModel.findByIdAndUpdate(findInventory._id, { tog: tog, isConvertFinalToTog: false }, { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
};
CgInventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(roInventory_1.RoInventory.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(cgInventory_1.CgInventory.name)),
    __param(3, (0, mongoose_1.InjectModel)(cgConsumption_1.CgConsumption.name)),
    __param(4, (0, mongoose_1.InjectModel)(silverProductMaster_1.SilverProduct.name)),
    __param(5, (0, mongoose_1.InjectModel)(cgOrder_1.CgOrder.name)),
    __param(6, (0, mongoose_1.InjectModel)(cggrowthFactorInfo_1.CgGrowthFactor.name)),
    __param(7, (0, mongoose_1.InjectModel)(roMaster_1.RoMaster.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CgInventoryService);
exports.CgInventoryService = CgInventoryService;
;
//# sourceMappingURL=cg-inventory.service.js.map