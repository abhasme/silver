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
exports.CgConsumptionService = void 0;
const common_1 = require("@nestjs/common");
const cgConsumption_1 = require("../../entities/Silver/cgConsumption");
const cgOrder_1 = require("../../entities/Silver/cgOrder");
const cgInventory_1 = require("../../entities/Silver/cgInventory");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const roMaster_1 = require("../../entities/Silver/roMaster");
const users_entity_1 = require("../../entities/users.entity");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const response_cgConsumption_dto_1 = require("../../Silver/cg-consumption/dto/response-cgConsumption.dto");
const ObjectId = require('mongoose').Types.ObjectId;
const jwt_helper_1 = require("../../common/utils/jwt.helper");
let CgConsumptionService = class CgConsumptionService {
    constructor(cgInventoryModel, cgConsumptionModel, silverProductModel, cgOrderModel, userModel, roMasterModel) {
        this.cgInventoryModel = cgInventoryModel;
        this.cgConsumptionModel = cgConsumptionModel;
        this.silverProductModel = silverProductModel;
        this.cgOrderModel = cgOrderModel;
        this.userModel = userModel;
        this.roMasterModel = roMasterModel;
    }
    async getRecommendationOrder(productId) {
        try {
            const order_recommentdation = await this.cgOrderModel.aggregate([
                {
                    $match: {
                        active: true,
                        $and: [
                            {
                                productId: productId
                            },
                            {
                                "cg.stage": "PENDING"
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
            let order = order_recommentdation.length > 0 ? order_recommentdation[0].totalQuantity : 0;
            return order;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
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
                                $and: [{ "cg.stage": "ACCEPT" }, { "wip.stage": "PENDING" }]
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
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async createConsumption(createConsumptionDto, req) {
        try {
            let date = await (0, jwt_helper_1.dateFormate)(new Date());
            let authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const findInventoryExist = await this.cgInventoryModel.findOne({
                productId: ObjectId(createConsumptionDto.productId),
            });
            let orderRecommendation;
            let onHandStatus = 0;
            let onHandStock = 0;
            let qualifiedDemand = 0;
            let togValue = 0;
            let openOrderValue;
            let inventoryId;
            if (findInventoryExist) {
                inventoryId = findInventoryExist._id;
                togValue = Number(findInventoryExist.tog);
                openOrderValue = findInventoryExist.openOrder;
                onHandStock = Number(findInventoryExist.onHandStock);
                qualifiedDemand = Number(findInventoryExist.qualifiedDemand);
            }
            else {
                throw new common_1.BadRequestException("inventory not exit");
            }
            if (createConsumptionDto.qty > onHandStock) {
                throw new common_1.BadRequestException("consumption quantity more then hand on stock");
            }
            if (qualifiedDemand >= createConsumptionDto.qty) {
                qualifiedDemand = qualifiedDemand - createConsumptionDto.qty;
            }
            else if (createConsumptionDto.qty > qualifiedDemand) {
                qualifiedDemand = 0;
            }
            onHandStock = onHandStock - createConsumptionDto.qty;
            const openOrder = openOrderValue ? openOrderValue : await this.getOpenOrder(createConsumptionDto.productId);
            let order = await this.getRecommendationOrder(createConsumptionDto.productId);
            let plantLeadTime = Number(findInventoryExist.plantLeadTime);
            let findFactorOfSafety = await this.silverProductModel.findOne({ _id: ObjectId(createConsumptionDto.productId) });
            let tog = togValue;
            let netFlow = Number(onHandStock + openOrder
                - qualifiedDemand);
            let moq = Number(findInventoryExist.moq) ? Number(findInventoryExist.moq) : 1;
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
            let orderRecommendationNumber = Number(orderRecommendation * 100 / tog);
            if (isNaN(orderRecommendationNumber)) {
                orderRecommendationStatus = 0;
            }
            else {
                orderRecommendationStatus = Math.abs(Number(orderRecommendationNumber) * 100 / tog);
            }
            let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);
            if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                onHandStatus = 0;
            }
            else {
                onHandStatus = onHandStatusNumber;
            }
            let flag = await (0, jwt_helper_1.flagFunction)(tog, onHandStock);
            let inventoryObject = {
                productId: createConsumptionDto.productId,
                createdBy: authInfo._id,
                plantLeadTime: plantLeadTime,
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
            if (findInventoryExist) {
                const updateInventory = await this.cgInventoryModel.findByIdAndUpdate(findInventoryExist._id, inventoryObject, { new: true, useFindAndModify: false });
                inventoryId = findInventoryExist._id;
            }
            if (orderRecommendation > 0) {
                await this.cgOrderModel.deleteMany({
                    productId: createConsumptionDto.productId,
                    "cg.stage": "PENDING"
                });
                const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                let order1 = new this.cgOrderModel(Object.assign(Object.assign({}, createConsumptionDto), { createdBy: authInfo._id, qty: Number(orderRecommendation), inventoryId: inventoryId, status: flag, createdAt: date, uniqueNumber: uniqueNumber, "recommendation.qty": Number(orderRecommendation), "cg.qty": Number(orderRecommendation), "recommendation.createdAt": date, "cg.createdAt": date }));
                order1.save();
            }
            else if (orderRecommendation == 0) {
                await this.cgOrderModel.updateMany({
                    inventoryId: inventoryId,
                    "cg.stage": "PENDING"
                }, { active: false });
            }
            const consumption = new this.cgConsumptionModel(Object.assign(Object.assign({}, createConsumptionDto), { createdAt: date, inventoryId: inventoryId, createdBy: authInfo._id }));
            if (consumption.save()) {
                return new response_cgConsumption_dto_1.GetCgConsumptionInfoDto(consumption);
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getAllConsumption(paginationDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const sortFields = {};
            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false };
            }
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
            const filter = await (0, jwt_helper_1.multiSelectorFunction)(paginationDto);
            const consumption = await this.cgConsumptionModel.aggregate([
                {
                    $match: activeCondition
                },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, itemCode: 1, itemDescription: 1, productName: 1, categoryid: 1, subcategoryid: 1 } }
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
                        from: "romasters",
                        localField: "roId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, roName: 1 } }
                        ],
                        as: "roMasterInfo",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        roName: { $ifNull: [{ $first: "$roMasterInfo.roName" }, ""] },
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        qty: { $ifNull: ["$qty", 0] },
                        date: { $ifNull: ["$date", ""] },
                        dateRange: { $ifNull: ["$date", ""] },
                        active: { $ifNull: ["$active", false] },
                        createdAt: 1,
                        createdAt1: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    },
                },
                { $match: filter },
                {
                    $match: {
                        $or: [
                            { qty: { $eq: parseInt(paginationDto.search) } },
                            { date: { $regex: paginationDto.search, '$options': 'i' } },
                            { roName: { $regex: paginationDto.search, '$options': 'i' } },
                            { productName: { $regex: paginationDto.search, '$options': 'i' } },
                            { itemDescription: { $regex: paginationDto.search, '$options': 'i' } },
                            { itemDescription: { $eq: paginationDto.search } },
                            { itemCode: { $regex: paginationDto.search, '$options': 'i' } },
                            { cpName: { $regex: paginationDto.search, '$options': 'i' } },
                            { categoryName: { $regex: paginationDto.search, '$options': 'i' } },
                            { subCategoryName: { $regex: paginationDto.search, '$options': 'i' } },
                            { createdAt1: { $regex: paginationDto.search, '$options': 'i' } },
                            { qualifiedDemand: { $eq: parseInt(paginationDto.search) } },
                            { unit: { $eq: parseInt(paginationDto.search) } },
                            { openOrder: { $eq: parseInt(paginationDto.search) } },
                        ]
                    }
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
            if (!consumption) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return consumption;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getConsumptionInfo(id) {
        try {
            const data = await this.cgConsumptionModel.aggregate([
                { $match: { "_id": ObjectId(id) } },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, itemCode: 1, itemDescription: 1, productName: 1, categoryid: 1, subcategoryid: 1 } }
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
                        from: "cginventories",
                        localField: "productId",
                        foreignField: "productId",
                        pipeline: [
                            { $project: { _id: 1, productId: 1, tog: 1, onHandStock: 1, qualifiedDemand: 1 } }
                        ],
                        as: "inventoryInfo",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        tog: { $ifNull: [{ $first: "$inventoryInfo.tog" }, 0] },
                        onHandStock: { $ifNull: [{ $first: "$inventoryInfo.onHandStock" }, 0] },
                        qualifiedDemand: { $ifNull: [{ $first: "$inventoryInfo.qualifiedDemand" }, 0] },
                        qty: { $ifNull: ["$qty", 0] },
                        date: { $ifNull: ["$date", ""] },
                        active: { $ifNull: ["$active", false] },
                    },
                },
                { $limit: 1 },
            ]).exec();
            if (!data) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return new response_cgConsumption_dto_1.GetCgConsumptionInfoDto(data[0]);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async UpdateConsumption(updateConsumptionDto, req) {
        try {
            let date = await (0, jwt_helper_1.dateFormate)(new Date());
            let authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            if (!updateConsumptionDto.consumptionId) {
                throw new common_1.BadRequestException("consumption not exit");
            }
            let orderRecommendation;
            let onHandStatus = 0;
            let flag = "BLACK";
            let onHandStock = 0;
            let qualifiedDemand = 0;
            const findInventoryExist = await this.cgInventoryModel.findOne({
                productId: ObjectId(updateConsumptionDto.productId)
            });
            onHandStock = findInventoryExist.onHandStock ? findInventoryExist.onHandStock : onHandStock;
            qualifiedDemand = findInventoryExist.qualifiedDemand ? findInventoryExist.qualifiedDemand : qualifiedDemand;
            if (updateConsumptionDto.qty > onHandStock) {
                throw new common_1.BadRequestException("consumption quantity more then hand on stock");
            }
            if (qualifiedDemand >= updateConsumptionDto.qty) {
                qualifiedDemand = qualifiedDemand - updateConsumptionDto.qty;
            }
            else if (updateConsumptionDto.qty > qualifiedDemand) {
                qualifiedDemand = 0;
            }
            onHandStock = onHandStock - updateConsumptionDto.qty;
            const openOrder = await this.getOpenOrder(updateConsumptionDto.productId);
            let tog = Number(findInventoryExist.tog);
            let plantLeadTime = Number(findInventoryExist.plantLeadTime);
            let growthFactor = Number(findInventoryExist.growthFactor);
            let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
            let findProduct = await this.silverProductModel.findOne({ _id: ObjectId(updateConsumptionDto.productId) });
            let moq = Number(findInventoryExist.moq) ? Number(findInventoryExist.moq) : 1;
            let tog_net = await Math.abs(Number(tog - netFlow));
            if (netFlow >= tog) {
                orderRecommendation = 0;
            }
            else if (tog_net < moq) {
                orderRecommendation = Number(moq);
            }
            else if (tog_net > moq) {
                orderRecommendation = moq * Math.round(Math.abs(tog_net / moq));
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
                productId: updateConsumptionDto.productId,
                createdBy: authInfo._id,
                plantLeadTime: plantLeadTime,
                growthFactor: growthFactor,
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
            const updateInventory = await this.cgInventoryModel.findByIdAndUpdate({ _id: findInventoryExist._id }, Object.assign({}, inventoryObject), { new: true, useFindAndModify: false });
            if (orderRecommendation > 0) {
                await this.cgOrderModel.deleteMany({
                    inventoryId: findInventoryExist._id,
                    "cg.stage": "PENDING"
                });
                const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                let order = new this.cgOrderModel(Object.assign(Object.assign({}, updateConsumptionDto), { createdBy: authInfo._id, qty: Number(orderRecommendation), inventoryId: findInventoryExist._id, status: flag, createdAt: date, uniqueNumber: uniqueNumber, "recommendation.qty": Number(orderRecommendation), "cg.qty": Number(orderRecommendation), "recommendation.createdAt": date, "cg.createdAt": date }));
                order.save();
            }
            else if (orderRecommendation == 0) {
                await this.cgOrderModel.updateMany({
                    inventoryId: findInventoryExist._id,
                    "cg.stage": "PENDING"
                }, { active: false });
            }
            await this.cgConsumptionModel.findByIdAndUpdate({ _id: ObjectId(updateConsumptionDto.consumptionId) }, Object.assign(Object.assign({}, updateConsumptionDto), { inventoryId: findInventoryExist._id }), { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async importConsumption(req, createConsumptionDto) {
        try {
            let date = await (0, jwt_helper_1.dateFormate)(new Date());
            let errorArrray = [];
            let consumptionArr = [];
            let authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const dataArray = Array.isArray(createConsumptionDto) ? createConsumptionDto : Object.values(createConsumptionDto);
            const mappedArray = await Promise.all(dataArray.map(async (consumption) => {
                return new Promise(async (resolve, reject) => {
                    let productExist = await this.silverProductModel.findOne({ productName: consumption.productName });
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
                    const currentDate = new Date();
                    const dateToCompare = new Date(consumption.date);
                    if (dateToCompare > currentDate) {
                        errString += ` Can not add of future date `;
                    }
                    const checkNumber = (property, errorMessage) => {
                        if (typeof property !== 'number') {
                            errString += `${errorMessage} ,`;
                        }
                    };
                    checkBlank(consumption.productName, "productName is blank");
                    checkBlank(consumption.qty, "qty is blank");
                    checkBlank(consumption.date, "date is blank");
                    if (!errString) {
                        if (productExist && (productExist != null)) {
                            let flag = "WHIGHT";
                            let onHandStock = 0;
                            let qualifiedDemand = 0;
                            let openOrder = 0;
                            let orderRecommendation;
                            let onHandStatus;
                            const inventoryExist = await this.cgInventoryModel.findOne({ productId: productExist._id });
                            if (inventoryExist) {
                                if (consumption.qty > inventoryExist.onHandStock) {
                                    errString += "consumption quantity more then hand on stock";
                                }
                                else {
                                    if (inventoryExist.qualifiedDemand >= consumption.qty) {
                                        qualifiedDemand = inventoryExist.qualifiedDemand - consumption.qty;
                                    }
                                    else if (consumption.qty > inventoryExist.qualifiedDemand) {
                                        qualifiedDemand = 0;
                                    }
                                    onHandStock = inventoryExist.onHandStock - consumption.qty;
                                    const consumptionAdd = new this.cgConsumptionModel(Object.assign(Object.assign({}, consumption), { createdAt: await (0, jwt_helper_1.dateFormate)(consumption.date), date: new Date(consumption.date), productId: productExist._id, createdBy: authInfo._id }));
                                    consumptionAdd.save();
                                    consumptionAdd;
                                    const openOrder = await this.getOpenOrder(inventoryExist.productId);
                                    let plantLeadTime = Number(inventoryExist.plantLeadTime);
                                    const currentDate = new Date();
                                    const thirteenWeeksAgo = new Date();
                                    thirteenWeeksAgo.setDate(currentDate.getDate() - 13 * 7);
                                    let tog = inventoryExist.tog;
                                    let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
                                    let moq = Number(inventoryExist.moq) ? Number(inventoryExist.moq) : 1;
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
                                    let orderRecommendationNumber = Number(orderRecommendation * 100 / tog);
                                    if (isNaN(orderRecommendationNumber)) {
                                        orderRecommendationStatus = 0;
                                    }
                                    else {
                                        orderRecommendationStatus = orderRecommendationNumber;
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
                                        productId: productExist._id,
                                        createdBy: authInfo._id,
                                        plantLeadTime: plantLeadTime,
                                        tog: Math.round(tog / 10) * 10,
                                        openOrder: openOrder,
                                        netFlow: Math.abs(netFlow),
                                        moq: moq,
                                        orderRecommendation: orderRecommendation,
                                        orderRecommendationStatus: orderRecommendationStatus,
                                        onHandStatus: onHandStatus,
                                        flag: flag,
                                        onHandStock: onHandStock,
                                    };
                                    await this.cgInventoryModel.findByIdAndUpdate({ _id: inventoryExist._id }, inventoryObject, { new: true, useFindAndModify: false });
                                    if (orderRecommendation > 0) {
                                        const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                                        let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                                        await this.cgOrderModel.deleteMany({
                                            productId: productExist._id,
                                            "cg.stage": "PENDING"
                                        });
                                        let order = new this.cgOrderModel({
                                            productId: productExist._id,
                                            createdBy: authInfo._id,
                                            qty: Number(orderRecommendation),
                                            inventoryId: inventoryExist._id,
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
                                }
                            }
                            else {
                                consumptionArr.push({
                                    createdAt: date,
                                    productId: productExist._id,
                                });
                                const consumptionAdd = new this.cgConsumptionModel(Object.assign(Object.assign({}, consumption), { date: await (0, jwt_helper_1.excelDateToYYYYMMDD)(consumption.date).toISOString(), createdAt: date, productId: productExist._id, createdBy: authInfo._id }));
                                consumptionAdd.save();
                                consumptionAdd;
                            }
                        }
                        else {
                            await checkNumber(consumption.qty, "qty should be number");
                            await checkExist(productExist, "product does not exist");
                        }
                    }
                    if (errString !== "") {
                        consumption["error"] = errString;
                        errorArrray.push(consumption);
                    }
                    resolve(consumption);
                });
            }));
            if (consumptionArr.length > 0) {
                const addInventory = await (0, jwt_helper_1.duplicateRemove)(consumptionArr);
                if (addInventory.length > 0) {
                    addInventory.forEach(async (ele) => {
                        let productExist = await this.silverProductModel.findOne({ _id: ele.productId });
                        let flag = "WHIGHT";
                        let onHandStock = 0;
                        let qualifiedDemand = 0;
                        let openOrder = 0;
                        let orderRecommendation;
                        let onHandStatus;
                        let plantLeadTime = 0;
                        let tog = 0;
                        let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
                        let moq = Number(1);
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
                        let orderRecommendationNumber = Number(orderRecommendation * 100 / tog);
                        let orderRecommendationStatus = 0;
                        if (isNaN(orderRecommendationNumber)) {
                            orderRecommendationStatus = 0;
                        }
                        else {
                            orderRecommendationStatus = orderRecommendationNumber;
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
                            productId: productExist._id,
                            createdBy: authInfo._id,
                            plantLeadTime: plantLeadTime,
                            tog: Math.round(tog / 10) * 10,
                            openOrder: openOrder,
                            netFlow: Math.abs(netFlow),
                            moq: moq,
                            orderRecommendation: orderRecommendation,
                            orderRecommendationStatus: orderRecommendationStatus,
                            onHandStatus: onHandStatus,
                            flag: flag,
                            onHandStock: onHandStock,
                            qualifiedDemand: qualifiedDemand,
                        };
                        const inventory = new this.cgInventoryModel(inventoryObject);
                        await inventory.save();
                        if (orderRecommendation > 0) {
                            const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                            let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                            let order = new this.cgOrderModel({
                                productId: productExist._id,
                                createdBy: authInfo._id,
                                qty: Number(orderRecommendation),
                                inventoryId: inventory._id,
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
                    });
                }
            }
            return new response_cgConsumption_dto_1.GetCgConsumptionInfoDto({ mappedArray: mappedArray, errorArrray: errorArrray });
        }
        catch (e) {
        }
        ;
    }
    ;
    async updateConsumptionStatus(id, updateStatusConsumptionDto) {
        try {
            let findConsumption = await this.cgConsumptionModel.findOne({
                _id: ObjectId(id)
            });
            if (!findConsumption) {
                throw new common_1.BadRequestException("consumption not exit already exist");
            }
            else {
                const findProduct = await this.silverProductModel.findOne({ productId: findConsumption.productId, active: false });
                if (findProduct) {
                    throw new common_1.BadRequestException("product is inactive");
                }
                return await this.cgConsumptionModel.findOneAndUpdate({ _id: ObjectId(id) }, { active: updateStatusConsumptionDto.active }, { new: true, useFindAndModify: false });
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getConsumptionDropDown(req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const channelPartner = await this.cgConsumptionModel.aggregate([
                {
                    $match: { active: true }
                },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, itemCode: 1, itemDescription: 1, productName: 1, categoryid: 1, subcategoryid: 1 } }
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
                        from: "romasters",
                        localField: "roId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, roName: 1 } }
                        ],
                        as: "roMasterInfo",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        roName: { $ifNull: [{ $first: "$roMasterInfo.roName" }, ""] },
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        qty: { $ifNull: ["$qty", 0] },
                        date: { $ifNull: ["$date", ""] },
                        active: { $ifNull: ["$active", false] },
                    },
                },
            ]).exec();
            if (!channelPartner) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return channelPartner;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getCgInventoryList(req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const ro = await this.cgInventoryModel.aggregate([
                {
                    $match: { active: true }
                },
                {
                    $lookup: {
                        from: "silverproducts",
                        localField: "productId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, itemCode: 1, itemDescription: 1, productName: 1, categoryid: 1, subcategoryid: 1 } }
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
                        _id: 1,
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        qty: { $ifNull: ["$qty", 0] },
                        tog: { $ifNull: ["$tog", 0] },
                        qualifiedDemand: { $ifNull: ["$qualifiedDemand", 0] },
                        onHandStock: { $ifNull: ["$onHandStock", 0] },
                        date: { $ifNull: ["$date", ""] },
                        active: { $ifNull: ["$active", false] },
                    },
                },
            ]).exec();
            if (!ro) {
                throw new common_1.BadRequestException('Data Not Found');
            }
            return ro;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
};
CgConsumptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cgInventory_1.CgInventory.name)),
    __param(1, (0, mongoose_1.InjectModel)(cgConsumption_1.CgConsumption.name)),
    __param(2, (0, mongoose_1.InjectModel)(silverProductMaster_1.SilverProduct.name)),
    __param(3, (0, mongoose_1.InjectModel)(cgOrder_1.CgOrder.name)),
    __param(4, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __param(5, (0, mongoose_1.InjectModel)(roMaster_1.RoMaster.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CgConsumptionService);
exports.CgConsumptionService = CgConsumptionService;
;
//# sourceMappingURL=cg-consumption.service.js.map