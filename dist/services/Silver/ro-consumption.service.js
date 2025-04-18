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
exports.RoConsumptionService = void 0;
const common_1 = require("@nestjs/common");
const roConsumption_1 = require("../../entities/Silver/roConsumption");
const roOrder_1 = require("../../entities/Silver/roOrder");
const cgOrder_1 = require("../../entities/Silver/cgOrder");
const roInventory_1 = require("../../entities/Silver/roInventory");
const cgInventory_1 = require("../../entities/Silver/cgInventory");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const roMaster_1 = require("../../entities/Silver/roMaster");
const users_entity_1 = require("../../entities/users.entity");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const response_roConsumption_dto_1 = require("../../Silver/ro-consumption/dto/response-roConsumption.dto");
const jwt_helper_1 = require("../../common/utils/jwt.helper");
const ObjectId = require('mongoose').Types.ObjectId;
const jwt_helper_2 = require("../../common/utils/jwt.helper");
;
function isRoIn(customer) {
    return (customer &&
        typeof customer === "object" &&
        typeof customer.roName === "string" &&
        typeof customer.contactPersonName === "string");
}
;
function isProductIn(product) {
    return (product &&
        typeof product === "object" &&
        typeof product.itemCode === "string" &&
        typeof product.itemDescription === "string" &&
        typeof product.productName === "string" &&
        product.categoryid &&
        typeof product.categoryid === "object" &&
        product.categoryid._id instanceof ObjectId &&
        typeof product.categoryid.categoryName === "string" &&
        product.subcategoryid &&
        typeof product.subcategoryid === "object" &&
        product.subcategoryid._id instanceof ObjectId &&
        typeof product.subcategoryid.subcategoryName === "string");
}
let RoConsumptionService = class RoConsumptionService {
    constructor(cgInventoryModel, roInventoryModel, roConsumptionModel, silverProductModel, roOrderModel, cgOrderModel, userModel, roMasterModel) {
        this.cgInventoryModel = cgInventoryModel;
        this.roInventoryModel = roInventoryModel;
        this.roConsumptionModel = roConsumptionModel;
        this.silverProductModel = silverProductModel;
        this.roOrderModel = roOrderModel;
        this.cgOrderModel = cgOrderModel;
        this.userModel = userModel;
        this.roMasterModel = roMasterModel;
    }
    async changeUniqueNumber() {
        var _a, e_1, _b, _c;
        try {
            let documentsToUpdate = await this.roOrderModel.find({ "cg.status": true, "cg.stage": "PENDING", uniqueNumber: 1 });
            try {
                for (var _d = true, documentsToUpdate_1 = __asyncValues(documentsToUpdate), documentsToUpdate_1_1; documentsToUpdate_1_1 = await documentsToUpdate_1.next(), _a = documentsToUpdate_1_1.done, !_a;) {
                    _c = documentsToUpdate_1_1.value;
                    _d = false;
                    try {
                        const document = _c;
                        const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                        let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                        const updatedDocument = await this.roOrderModel.findByIdAndUpdate(document._id, { $set: { uniqueNumber: uniqueNumber } }, { new: true });
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
    async changeCgUniqueNumber() {
        var _a, e_2, _b, _c;
        try {
            let documentsToUpdate = await this.cgInventoryModel.find({ "cg.status": true, "cg.stage": "PENDING", uniqueNumber: 1 });
            try {
                for (var _d = true, documentsToUpdate_2 = __asyncValues(documentsToUpdate), documentsToUpdate_2_1; documentsToUpdate_2_1 = await documentsToUpdate_2.next(), _a = documentsToUpdate_2_1.done, !_a;) {
                    _c = documentsToUpdate_2_1.value;
                    _d = false;
                    try {
                        const document = _c;
                        const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                        let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                        const updatedDocument = await this.cgOrderModel.findByIdAndUpdate(document._id, { $set: { uniqueNumber: uniqueNumber } }, { new: true });
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = documentsToUpdate_2.return)) await _b.call(documentsToUpdate_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    ;
    async getAvgWeeklyConsumptionLY4M(roId, productId) {
        try {
            let currentMonth = (new Date()).getMonth();
            let currentYear = (new Date()).getFullYear();
            const previousYear = currentYear - 1;
            let dateObj = await (0, jwt_helper_1.calculateDateRangeForLYM)(currentMonth, currentYear);
            let sameMonthAvgConsumption = 0;
            const startDate = new Date(dateObj.startDate);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(dateObj.endDate);
            endDate.setHours(23, 59, 59, 999);
            let findSameMonthCon = await this.roConsumptionModel.aggregate([
                {
                    $match: {
                        roId: ObjectId(roId),
                        productId: ObjectId(productId),
                        date: {
                            $gte: startDate,
                            $lte: endDate,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalQty: { $sum: "$qty" },
                    },
                }
            ]);
            if (findSameMonthCon.length > 0) {
                sameMonthAvgConsumption = (findSameMonthCon[0].totalQty) / 4;
            }
            if (sameMonthAvgConsumption >= 0 && sameMonthAvgConsumption <= 4) {
                sameMonthAvgConsumption = 1;
            }
            return sameMonthAvgConsumption;
        }
        catch (e) {
            console.log(e);
        }
    }
    ;
    async getAvgWeeklyConsumptionL12(roId, productId) {
        try {
            let dateObj = await (0, jwt_helper_1.calculateDateRangeForCym)(new Date());
            let sameMonthAvgConsumption = 0;
            let findOldConsumption = await this.roConsumptionModel.aggregate([
                {
                    $match: {
                        roId: ObjectId(roId),
                        productId: ObjectId(productId),
                        date: {
                            $lte: new Date(dateObj.startDate),
                        },
                    },
                },
            ]);
            if (findOldConsumption.length > 0) {
                let findSameMonthCon = await this.roConsumptionModel.aggregate([
                    {
                        $match: {
                            roId: ObjectId(roId),
                            productId: ObjectId(productId),
                            date: {
                                $gte: new Date(dateObj.startDate),
                                $lt: new Date(dateObj.endDate),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalQty: { $sum: "$qty" },
                        },
                    }
                ]);
                if (findSameMonthCon.length > 0) {
                    sameMonthAvgConsumption = (findSameMonthCon[0].totalQty) / 12;
                }
            }
            else {
                const dateResult = await this.roConsumptionModel.aggregate([
                    { $match: { roId: ObjectId(roId), productId: ObjectId(productId), } },
                    { $sort: { date: 1 } },
                    { $limit: 1 }
                ]);
                let startDate = new Date();
                if (dateResult.length > 0) {
                    startDate = dateResult[0].date;
                }
                let findSameMonthCon = await this.roConsumptionModel.aggregate([
                    {
                        $match: {
                            roId: ObjectId(roId),
                            productId: ObjectId(productId),
                            date: {
                                $gt: new Date(dateObj.startDate),
                                $lt: new Date(dateObj.endDate),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalQty: { $sum: "$qty" },
                        },
                    }
                ]);
                if (findSameMonthCon.length > 0) {
                    let monthDifferences = 0;
                    monthDifferences = await (0, jwt_helper_1.monthDifference)(startDate, new Date(dateObj.endDate));
                    if (monthDifferences)
                        sameMonthAvgConsumption = (findSameMonthCon[0].totalQty) / Number(monthDifferences);
                }
            }
            if (sameMonthAvgConsumption >= 0 && sameMonthAvgConsumption <= 4) {
                sameMonthAvgConsumption = 1;
            }
            return sameMonthAvgConsumption;
        }
        catch (e) {
            console.log(e);
        }
        ;
    }
    ;
    async getAvgWeeklyConsumptionL3(roId, productId) {
        try {
            const currentDate = new Date();
            let avgWeeklyConsumption = 0;
            const previousMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const thirteenWeeksAgoDate = new Date();
            thirteenWeeksAgoDate.setDate(currentDate.getDate() - 13 * 7);
            const year = thirteenWeeksAgoDate.getFullYear();
            const month = thirteenWeeksAgoDate.getMonth();
            const firstDayOfMonth = new Date(year, month, 1);
            const thirteenWeeksAgo = firstDayOfMonth;
            let checkConsumptionExit = await this.roConsumptionModel.aggregate([{
                    $match: { date: { $lt: thirteenWeeksAgo }, roId: roId, productId: productId }
                },
            ]);
            if (checkConsumptionExit.length > 0) {
                let totalConsumption = await this.roConsumptionModel.aggregate([
                    {
                        $match: {
                            roId: roId,
                            productId: productId,
                            date: {
                                $gt: thirteenWeeksAgo,
                                $lte: previousMonthLastDate,
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
                    avgWeeklyConsumption = (totalConsumption[0].totalQty) / 3;
                }
            }
            else {
                let findConsumption = await this.roConsumptionModel.aggregate([
                    {
                        $match: { productId: productId, roId: roId }
                    },
                    {
                        $group: {
                            _id: null,
                            minDate: { $min: "$date" },
                            maxDate: { $max: previousMonthLastDate },
                            totalQuality: { $sum: "$qty" }
                        }
                    },
                    {
                        $project: {
                            maxDate: previousMonthLastDate,
                            minDate: "$minDate",
                            totalQuality: "$totalQuality",
                            weekDifference: {
                                $ceil: {
                                    $divide: [
                                        { $subtract: ["$maxDate", "$minDate"] },
                                        1000 * 60 * 60 * 24 * 30
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
            if (avgWeeklyConsumption >= 0 && avgWeeklyConsumption <= 4) {
                avgWeeklyConsumption = 1;
            }
            return avgWeeklyConsumption;
        }
        catch (e) {
            console.log(e);
        }
    }
    async getCgOpenOrder(productId) {
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
        catch (error) {
            return 0;
        }
    }
    ;
    async calculateRoSigma(productId) {
        try {
            let roInventory = await this.roInventoryModel.aggregate([
                { $match: { productId: ObjectId(productId), active: true } },
                {
                    $project: {
                        tog: 1,
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalMultipliedByGrowthFactor: { $sum: "$tog" }
                    }
                }
            ]);
            let roSigma = 0;
            if (roInventory.length > 0) {
                roSigma = roInventory[0].totalMultipliedByGrowthFactor;
            }
            return roSigma;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async sumOfQualifiedDemand(productId) {
        try {
            let roInventory = await this.roInventoryModel.aggregate([
                {
                    $match: {
                        productId: ObjectId(productId),
                        active: true,
                    }
                },
                {
                    $project: {
                        "orderRecommendation": 1
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalOrderRecommendation: { $sum: "$orderRecommendation" }
                    }
                }
            ]);
            let totalRecommendation = 0;
            if (roInventory.length > 0) {
                totalRecommendation = roInventory[0].totalOrderRecommendation;
            }
            return totalRecommendation;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async createCgInventory(productId, qualifiedDemands, createdBy) {
        try {
            let date = await (0, jwt_helper_2.dateFormate)(new Date());
            const findInventory = await this.cgInventoryModel.findOne({ productId: ObjectId(productId) });
            if (!findInventory) {
                let avgWeeklyConsumption = 0;
                let orderRecommendation = 0;
                let onHandStatus = 0;
                let onHandStock = 0;
                const openOrder = 0;
                let flag = "BLACK";
                let roSigma = 0;
                let togRecommendation = 0;
                let tog = 0;
                let sumOfQualifiedDemand = await this.sumOfQualifiedDemand(productId);
                let qualifiedDemand = Number(sumOfQualifiedDemand) ? Number(sumOfQualifiedDemand) : 0;
                let plantLeadTime = 1;
                let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
                let moq = 1;
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
                if (togRecommendation >= 1 && togRecommendation <= 4) {
                    togRecommendation = 5;
                }
                flag = await (0, jwt_helper_2.flagFunction)(tog, onHandStock);
                let inventoryObject = {
                    isConvertFinalToTog: true,
                    productId: productId,
                    avgWeeklyConsumption: avgWeeklyConsumption,
                    plantLeadTime: plantLeadTime,
                    factorOfSafety: Number(0),
                    tog: tog,
                    togRecommendation: togRecommendation,
                    roSigma: roSigma,
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
                    if (orderRecommendation >= 0) {
                        const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                        let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                        let order = new this.cgOrderModel({
                            createdBy: createdBy,
                            qty: Number(orderRecommendation),
                            inventoryId: inventory.id,
                            productId: productId,
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
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateCgInventory(productId, qualifiedDemandData, createdBy) {
        try {
            let date = await (0, jwt_helper_2.dateFormate)(new Date());
            let findInventory = await this.cgInventoryModel.findOne({ productId: ObjectId(productId) });
            let silverProduct = await this.silverProductModel.findOne({ _id: ObjectId(productId) });
            if (findInventory) {
                let avgWeeklyConsumption;
                let orderRecommendation = 0;
                let onHandStatus = 0;
                let flag = "BLACK";
                let onHandStock = findInventory.onHandStock;
                let qualifiedDemand = 0;
                const openOrder = await this.getCgOpenOrder(productId);
                let leadTime = Number(findInventory.plantLeadTime);
                let roSigma = await this.calculateRoSigma(productId);
                let togRecommendation = (roSigma / 4) * findInventory.plantLeadTime;
                let sumOfQualifiedDemand = await this.sumOfQualifiedDemand(productId);
                qualifiedDemand = Number(sumOfQualifiedDemand);
                let tog = findInventory.tog;
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
                if (togRecommendation >= 0 && togRecommendation <= 4) {
                    togRecommendation = 5;
                }
                flag = await (0, jwt_helper_2.flagFunction)(tog, onHandStock);
                let inventoryObject = {
                    createdBy: createdBy,
                    avgWeeklyConsumption: avgWeeklyConsumption,
                    leadTime: leadTime,
                    factorOfSafety: Number(0),
                    tog: tog,
                    togRecommendation: togRecommendation,
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
                    await this.cgOrderModel.deleteMany({
                        inventoryId: findInventory._id,
                        "cg.stage": "PENDING"
                    });
                    const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                    let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                    let order = new this.cgOrderModel({
                        createdBy: createdBy,
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
                    await this.cgOrderModel.updateMany({
                        inventoryId: findInventory._id,
                        "cg.stage": "PENDING"
                    }, { active: false });
                }
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getRecommendationOrder(roId, productId) {
        try {
            const order_recommentdation = await this.roOrderModel.aggregate([
                {
                    $match: {
                        active: true,
                        $and: [
                            {
                                roId: roId,
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
    async getOpenOrder(roId, productId) {
        try {
            const result = await this.roOrderModel.aggregate([
                {
                    $match: {
                        active: true,
                        $and: [
                            {
                                roId: ObjectId(roId),
                                productId: ObjectId(productId)
                            },
                            {
                                $and: [{ $or: [{ "cg.stage": "ACCEPT" }, { "wip.stage": "ACCEPT" },] }, { "in_trasit.stage": "PENDING" },]
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
    async getAvgWeeklyConsumption(roId, productId) {
        try {
            let avgWeeklyConsumption = 0;
            const currentDate = new Date();
            const thirteenWeeksAgo = new Date();
            thirteenWeeksAgo.setDate(currentDate.getDate() - 13 * 7);
            let checkConsumptionExit = await this.roConsumptionModel.aggregate([{
                    $match: { date: { $lte: thirteenWeeksAgo }, roId: roId, productId: productId }
                },
            ]);
            if (checkConsumptionExit.length > 0) {
                let totalConsumption = await this.roConsumptionModel.aggregate([
                    {
                        $match: {
                            roId: roId,
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
                    avgWeeklyConsumption = (totalConsumption[0].totalQty) / 3;
                }
            }
            else {
                let findConsumption = await this.roConsumptionModel.aggregate([
                    {
                        $match: { productId: productId, roId: roId }
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
                                        1000 * 60 * 60 * 24 * 30
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
    async createConsumption(createConsumptionDto, req) {
        try {
            let date = await (0, jwt_helper_2.dateFormate)(new Date());
            let authInfo = await (0, jwt_helper_2.getAuthUserInfo)(req.headers);
            const findInventoryExist = await this.roInventoryModel.findOne({
                roId: ObjectId(createConsumptionDto.roId),
                productId: ObjectId(createConsumptionDto.productId),
            });
            let orderRecommendation;
            let onHandStatus = 0;
            let onHandStock = 0;
            let qualifiedDemand = 0;
            let togValue = 0;
            let openorderValue;
            let inventoryId;
            if (findInventoryExist) {
                inventoryId = findInventoryExist._id;
                togValue = Number(findInventoryExist.tog);
                openorderValue = findInventoryExist.openOrder;
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
            const openOrder = openorderValue ? openorderValue : await this.getOpenOrder(createConsumptionDto.roId, createConsumptionDto.productId);
            let findLeadTime = await this.roMasterModel.findOne({ _id: ObjectId(createConsumptionDto.roId) });
            let leadTime = Number(findInventoryExist.leadTime);
            let tog = togValue;
            let netFlow = Number(onHandStock + openOrder
                - qualifiedDemand);
            let moq = Number(findInventoryExist.moq);
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
            let flag = await (0, jwt_helper_2.flagFunction)(tog, onHandStock);
            let inventoryObject = {
                roId: createConsumptionDto.roId,
                productId: createConsumptionDto.productId,
                createdBy: authInfo._id,
                leadTime: leadTime,
                growthFactor: findLeadTime.growthFactor,
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
                await this.roInventoryModel.findByIdAndUpdate(findInventoryExist._id, inventoryObject, { new: true, useFindAndModify: false });
                inventoryId = findInventoryExist._id;
            }
            if (orderRecommendation > 0) {
                await this.roOrderModel.deleteMany({
                    roId: createConsumptionDto.roId,
                    productId: createConsumptionDto.productId,
                    "cg.stage": "PENDING"
                });
                const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                let order1 = new this.roOrderModel(Object.assign(Object.assign({}, createConsumptionDto), { createdBy: authInfo._id, qty: Number(orderRecommendation), inventoryId: inventoryId, status: flag, createdAt: date, uniqueNumber: uniqueNumber, "recommendation.qty": Number(orderRecommendation), "cg.qty": Number(orderRecommendation), "recommendation.createdAt": date, "cg.createdAt": date }));
                order1.save();
            }
            else if (orderRecommendation == 0) {
                await this.roOrderModel.updateMany({
                    inventoryId: inventoryId,
                    "cg.stage": "PENDING"
                }, { active: false });
            }
            const consumption = new this.roConsumptionModel(Object.assign(Object.assign({}, createConsumptionDto), { createdAt: date, inventoryId: inventoryId, createdBy: authInfo._id }));
            if (consumption.save()) {
                return new response_roConsumption_dto_1.GetRoConsumptionInfoDto(consumption);
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getAllConsumption(paginationDto, req) {
        try {
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const sortFields = {};
            let condition = {};
            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false };
            }
            if (paginationDto.roId) {
                condition = { roId: ObjectId(paginationDto.roId) };
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
            const filter = await (0, jwt_helper_2.multiSelectorFunction)(paginationDto);
            const consumption = await this.roConsumptionModel.aggregate([
                {
                    $match: activeCondition
                },
                {
                    $match: condition
                },
                {
                    $lookup: {
                        from: "romasters",
                        localField: "roId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, contactPersonName: 1, roName: 1 } }
                        ],
                        as: "roMasterInfo",
                    },
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
                        roId: { $ifNull: [{ $first: "$roMasterInfo._id" }, ""] },
                        cpName: { $ifNull: [{ $first: "$roMasterInfo.contactPersonName" }, ""] },
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
                            { productName: { $regex: paginationDto.search, '$options': 'i' } },
                            { itemDescription: { $regex: paginationDto.search, '$options': 'i' } },
                            { itemDescription: { $eq: paginationDto.search } },
                            { itemCode: { $regex: paginationDto.search, '$options': 'i' } },
                            { cpName: { $regex: paginationDto.search, '$options': 'i' } },
                            { roName: { $regex: paginationDto.search, '$options': 'i' } },
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
            const data = await this.roConsumptionModel.aggregate([
                { $match: { "_id": ObjectId(id) } },
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
                        from: "roinventories",
                        let: { productId: "$productId", roId: "$roId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$productId", "$$productId"] },
                                            { $eq: ["$roId", "$$roId"] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1, productId: 1, roId: 1, tog: 1, onHandStock: 1, qualifiedDemand: 1 } }
                        ],
                        as: "inventoryInfo"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        roId: { $ifNull: ["$roId", ""] },
                        roName: { $ifNull: [{ $first: "$roMasterInfo.roName" }, ""] },
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        onHandStock: { $ifNull: [{ $first: "$inventoryInfo.onHandStock" }, ""] },
                        tog: { $ifNull: [{ $first: "$inventoryInfo.tog" }, ""] },
                        qualifiedDemand: { $ifNull: [{ $first: "$inventoryInfo.qualifiedDemand" }, ""] },
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
            return new response_roConsumption_dto_1.GetRoConsumptionInfoDto(data[0]);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async UpdateConsumption(updateConsumptionDto, req) {
        try {
            let date = await (0, jwt_helper_2.dateFormate)(new Date());
            let authInfo = await (0, jwt_helper_2.getAuthUserInfo)(req.headers);
            if (!updateConsumptionDto.consumptionId) {
                throw new common_1.BadRequestException("consumption not exit");
            }
            let avgWeeklyConsumption;
            let orderRecommendation;
            let onHandStatus = 0;
            let flag = "BLACK";
            let onHandStock = 0;
            let qualifiedDemand = 0;
            const findInventoryExist = await this.roInventoryModel.findOne({
                roId: ObjectId(updateConsumptionDto.roId),
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
            const openOrder = await this.getOpenOrder(updateConsumptionDto.roId, updateConsumptionDto.productId);
            let tog = Number(findInventoryExist.tog);
            let leadTime = Number(findInventoryExist.leadTime);
            let growthFactor = Number(findInventoryExist.growthFactor);
            let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
            let findProduct = await this.silverProductModel.findOne({ _id: ObjectId(updateConsumptionDto.productId) });
            let moq = Number(findInventoryExist.moq);
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
            flag = await (0, jwt_helper_2.flagFunction)(tog, onHandStock);
            let inventoryObject = {
                roId: updateConsumptionDto.roId,
                productId: updateConsumptionDto.productId,
                createdBy: authInfo._id,
                avgWeeklyConsumption: avgWeeklyConsumption,
                leadTime: leadTime,
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
            const updateInventory = await this.roInventoryModel.findByIdAndUpdate({ _id: findInventoryExist._id }, Object.assign({}, inventoryObject), { new: true, useFindAndModify: false });
            if (orderRecommendation > 0) {
                await this.roOrderModel.deleteMany({
                    inventoryId: findInventoryExist._id,
                    "cg.stage": "PENDING"
                });
                const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                let order = new this.roOrderModel(Object.assign(Object.assign({}, updateConsumptionDto), { createdBy: authInfo._id, qty: Number(orderRecommendation), inventoryId: findInventoryExist._id, status: flag, createdAt: date, uniqueNumber: uniqueNumber, "recommendation.qty": Number(orderRecommendation), "cg.qty": Number(orderRecommendation), "recommendation.createdAt": date, "cg.createdAt": date }));
                order.save();
            }
            else if (orderRecommendation == 0) {
                await this.roOrderModel.updateMany({
                    inventoryId: findInventoryExist._id,
                    "cg.stage": "PENDING"
                }, { active: false });
            }
            await this.roConsumptionModel.findByIdAndUpdate({ _id: updateConsumptionDto.consumptionId }, Object.assign(Object.assign({}, updateConsumptionDto), { inventoryId: findInventoryExist._id }), { new: true, useFindAndModify: false });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async importConsumption(req, createConsumptionDto) {
        try {
            let date = await (0, jwt_helper_2.dateFormate)(new Date());
            let errorArray = [];
            let consumptionArr = [];
            let authInfo = await (0, jwt_helper_2.getAuthUserInfo)(req.headers);
            const mappedArray = await Promise.all(createConsumptionDto.map(async (consumption) => {
                return new Promise(async (resolve, reject) => {
                    let cpExist = await this.roMasterModel.findOne({ roName: consumption.roName });
                    let productExist = await this.silverProductModel.findOne({ productName: consumption.productName });
                    let errString = "";
                    const checkBlank = (property, errorMessage) => {
                        if (property === "" || property === null || property === "null" || property === "undefined" || property === undefined) {
                            errString += `${errorMessage}, `;
                        }
                    };
                    const checkExist = (property, errorMessage) => {
                        if (!property) {
                            errString += `${errorMessage}, `;
                        }
                    };
                    const checkNumber = (property, errorMessage) => {
                        if (typeof property !== 'number') {
                            errString += `${errorMessage}, `;
                        }
                    };
                    const currentDate = new Date();
                    const dateToCompare = new Date(consumption.date);
                    if (dateToCompare > currentDate) {
                        errString += "Cannot add consumption of a future date, ";
                    }
                    checkBlank(consumption.productName, "productName is blank");
                    checkBlank(consumption.roName, "roName is blank");
                    checkBlank(consumption.qty, "qty is blank");
                    checkBlank(consumption.date, "date is blank");
                    if (!errString) {
                        if (cpExist && productExist) {
                            let flag = "WHIGHT";
                            let onHandStock = 0;
                            let qualifiedDemand = 0;
                            let openOrder = 0;
                            let orderRecommendation;
                            let onHandStatus;
                            const inventoryExist = await this.roInventoryModel.findOne({ productId: productExist._id, roId: cpExist._id });
                            if (inventoryExist) {
                                if (consumption.updatedInventory == "NO") {
                                    const consumptionAdd = new this.roConsumptionModel(Object.assign(Object.assign({}, consumption), { createdAt: await (0, jwt_helper_2.dateFormate)(consumption.date), date: await (0, jwt_helper_2.dateFormate)(consumption.date), roId: cpExist._id, productId: productExist._id, createdBy: authInfo._id }));
                                    await consumptionAdd.save();
                                }
                                else {
                                    if (consumption.qty > inventoryExist.onHandStock) {
                                        errString += "consumption quantity more than on hand stock, ";
                                    }
                                    else {
                                        qualifiedDemand = Math.max(0, inventoryExist.qualifiedDemand - consumption.qty);
                                        onHandStock = inventoryExist.onHandStock - consumption.qty;
                                        const consumptionAdd = new this.roConsumptionModel(Object.assign(Object.assign({}, consumption), { createdAt: await (0, jwt_helper_2.dateFormate)(consumption.date), date: await (0, jwt_helper_2.dateFormate)(consumption.date), roId: cpExist._id, productId: productExist._id, createdBy: authInfo._id }));
                                        await consumptionAdd.save();
                                        openOrder = await this.getOpenOrder(inventoryExist.roId, inventoryExist.productId);
                                        let avgWeeklyConsumption = await this.getAvgWeeklyConsumption(inventoryExist.roId, inventoryExist.productId);
                                        let leadTime = Number(inventoryExist.leadTime);
                                        let growthFactor = Number(inventoryExist.growthFactor);
                                        let tog = inventoryExist.tog;
                                        let netFlow = onHandStock + openOrder - qualifiedDemand;
                                        let moq = Number(inventoryExist.moq);
                                        let tog_net = Math.abs(tog - netFlow);
                                        orderRecommendation = netFlow >= tog ? 0 : (tog_net < moq ? moq : moq * Math.round(tog_net / moq));
                                        let orderRecommendationNumber = Number(orderRecommendation * 100 / tog);
                                        let orderRecommendationStatus = isNaN(orderRecommendationNumber) ? 0 : orderRecommendationNumber;
                                        let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);
                                        onHandStatus = isNaN(onHandStatusNumber) ? 0 : onHandStatusNumber;
                                        flag = await (0, jwt_helper_2.flagFunction)(tog, onHandStock);
                                        let inventoryObject = {
                                            roId: cpExist._id,
                                            productId: productExist._id,
                                            createdBy: authInfo._id,
                                            leadTime: leadTime,
                                            growthFactor: 1,
                                            tog: tog,
                                            openOrder: openOrder,
                                            netFlow: Math.abs(netFlow),
                                            moq: moq,
                                            orderRecommendation: orderRecommendation,
                                            orderRecommendationStatus: orderRecommendationStatus,
                                            onHandStatus: onHandStatus,
                                            flag: flag,
                                            onHandStock: onHandStock,
                                            qualifiedDemand: qualifiedDemand,
                                            rWC: Math.floor(avgWeeklyConsumption)
                                        };
                                        await this.roInventoryModel.findByIdAndUpdate({ _id: inventoryExist._id }, inventoryObject, { new: true, useFindAndModify: false });
                                        if (orderRecommendation >= 0) {
                                            const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                                            let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                                            await this.roOrderModel.deleteMany({
                                                roId: cpExist._id,
                                                productId: productExist._id,
                                                "cg.stage": "PENDING"
                                            });
                                            let order = new this.roOrderModel({
                                                roId: cpExist._id,
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
                                            await order.save();
                                        }
                                    }
                                }
                            }
                            else {
                                consumptionArr.push({
                                    createdAt: date,
                                    roId: cpExist._id,
                                    productId: productExist._id,
                                });
                                const consumptionAdd = new this.roConsumptionModel(Object.assign(Object.assign({}, consumption), { date: consumption.date, createdAt: date, roId: cpExist._id, productId: productExist._id, createdBy: authInfo._id }));
                                await consumptionAdd.save();
                            }
                        }
                        else {
                            checkNumber(consumption.qty, "qty should be number");
                            checkExist(productExist, "product does not exist");
                            checkExist(cpExist, "ro does not exist");
                        }
                    }
                    if (errString !== "") {
                        consumption["error"] = errString;
                        errorArray.push(consumption);
                    }
                    resolve(consumption);
                });
            }));
            if (consumptionArr.length > 0) {
                const addInventory = await (0, jwt_helper_2.duplicateRemove)(consumptionArr);
                if (addInventory.length > 0) {
                    addInventory.forEach(async (ele) => {
                        let cpExist = await this.roMasterModel.findOne({ _id: ele.roId });
                        let productExist = await this.silverProductModel.findOne({ _id: ele.productId });
                        let flag = "WHIGHT";
                        let onHandStock = 0;
                        let qualifiedDemand = 0;
                        let openOrder = 0;
                        let orderRecommendation;
                        let onHandStatus;
                        let avgWeeklyConsumption = await this.getAvgWeeklyConsumption(ele.roId, ele.productId);
                        let leadTime = Number(cpExist.leadTime);
                        let growthFactor = Number(cpExist.growthFactor);
                        let tog = 1;
                        let netFlow = onHandStock + openOrder - qualifiedDemand;
                        let moq = 1;
                        let tog_net = Math.abs(tog - netFlow);
                        orderRecommendation = netFlow >= tog ? 0 : (tog_net <= moq ? moq : moq * Math.round(tog_net / moq));
                        let orderRecommendationNumber = Number(orderRecommendation * 100 / tog);
                        let orderRecommendationStatus = isNaN(orderRecommendationNumber) ? 0 : orderRecommendationNumber;
                        let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);
                        onHandStatus = isNaN(onHandStatusNumber) ? 0 : onHandStatusNumber;
                        flag = await (0, jwt_helper_2.flagFunction)(tog, onHandStock);
                        let LYM = Number(await this.getAvgWeeklyConsumptionLY4M(cpExist._id, productExist._id));
                        let CYM = Number(await this.getAvgWeeklyConsumptionL12(cpExist._id, productExist._id));
                        let L13 = Number(await this.getAvgWeeklyConsumptionL3(cpExist._id, productExist._id));
                        let LBSMax = Math.max(LYM, CYM, L13) / 4;
                        let LBS = LBSMax * cpExist.leadTime;
                        let SWB = LBSMax * cpExist.stockUpWeeks;
                        let togRecommendation = SWB + LBS;
                        if (togRecommendation >= 1 && togRecommendation <= 4) {
                            togRecommendation = 5;
                        }
                        let inventoryObject = {
                            togRecommendation: (Math.round(togRecommendation / 10) * 10),
                            isConvertFinalToTog: true,
                            isGrowthFactor: true,
                            LYM: Math.round(LYM),
                            CYM: Math.round(CYM),
                            L13: Math.round(L13),
                            LBS: Math.round(LBS),
                            SWB: Math.round(SWB),
                            tog: 1,
                            oldTog: 1,
                            roId: cpExist._id,
                            productId: productExist._id,
                            createdBy: authInfo._id,
                            leadTime: leadTime,
                            growthFactor: cpExist.growthFactor,
                            openOrder: openOrder,
                            netFlow: Math.abs(netFlow),
                            moq: moq,
                            orderRecommendation: orderRecommendation,
                            orderRecommendationStatus: orderRecommendationStatus,
                            onHandStatus: onHandStatus,
                            flag: flag,
                            onHandStock: onHandStock,
                            qualifiedDemand: qualifiedDemand,
                            stockUpWeeks: cpExist.stockUpWeeks,
                            rWC: Math.floor(avgWeeklyConsumption)
                        };
                        const inventory = new this.roInventoryModel(inventoryObject);
                        await inventory.save();
                        if (orderRecommendation >= 0) {
                            let order = new this.roOrderModel({
                                roId: cpExist._id,
                                productId: productExist._id,
                                createdBy: authInfo._id,
                                qty: Number(orderRecommendation),
                                inventoryId: inventory._id,
                                status: flag,
                                createdAt: date,
                                uniqueNumber: 1,
                                "recommendation.qty": Number(orderRecommendation),
                                "cg.qty": Number(orderRecommendation),
                                "recommendation.createdAt": date,
                                "cg.createdAt": date,
                            });
                            await order.save();
                        }
                    });
                }
            }
            await this.changeUniqueNumber();
            setTimeout(async () => {
                await this.changeUniqueNumber();
                console.log("Inside setTimeout function");
            }, 20000);
            setTimeout(async () => {
                const roInventoryExist = await this.roInventoryModel.find();
                if (roInventoryExist.length > 0) {
                    for (const ele of roInventoryExist) {
                        const cgInventoryExist = await this.cgInventoryModel.findOne({ productId: ele.productId });
                        if (cgInventoryExist) {
                            await this.updateCgInventory(ele.productId, ele.orderRecommendation, authInfo._id);
                        }
                        else {
                            await this.createCgInventory(ele.productId, ele.orderRecommendation, authInfo._id);
                        }
                    }
                }
                console.log("Inside setTimeout function");
            }, 20000);
            return new response_roConsumption_dto_1.GetRoConsumptionInfoDto({ mappedArray: mappedArray, errorArrray: errorArray });
        }
        catch (e) {
            console.error(e);
        }
    }
    ;
    async updateConsumptionStatus(id, updateStatusConsumptionDto) {
        try {
            let findConsumption = await this.roConsumptionModel.findOne({ _id: ObjectId(id) });
            if (!findConsumption) {
                throw new common_1.BadRequestException("consumption not exit already exist");
            }
            else {
                const findProduct = await this.silverProductModel.findOne({ productId: findConsumption.productId, active: false });
                const RO = await this.roMasterModel.findOne({ roId: findConsumption.roId, isActive: false });
                if (findProduct) {
                    throw new common_1.BadRequestException("product is inactive");
                }
                if (RO) {
                    throw new common_1.BadRequestException("RO inactive");
                }
                return await this.roConsumptionModel.findOneAndUpdate({ _id: ObjectId(id) }, { active: updateStatusConsumptionDto.active }, { new: true, useFindAndModify: false });
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getConsumptionDropDown(req) {
        try {
            const authInfo = await (0, jwt_helper_2.getAuthUserInfo)(req.headers);
            const channelPartner = await this.roConsumptionModel
                .find({ active: true })
                .populate({
                path: "roId",
                select: "contactPersonName roName",
                model: "RoMaster",
            })
                .populate({
                path: 'productId',
                select: 'itemDescription itemCode productName categoryid subcategoryid',
                model: 'SilverProduct',
                populate: [
                    {
                        path: 'categoryid',
                        select: 'categoryName',
                        model: 'SilverCategory',
                    },
                    {
                        path: 'subcategoryid',
                        select: 'subcategoryName',
                        model: 'SilverSubcategory',
                    },
                ],
            })
                .exec();
            if (!channelPartner || channelPartner.length === 0) {
                throw new common_1.BadRequestException("Data Not Found");
            }
            const data = channelPartner.map((item) => {
                const _id = item._id;
                const roId = item.roId ? item.roId._id : "";
                const qty = item.qty || 0;
                const date = item.date || "";
                const active = item.active || false;
                const roName = isRoIn(item.roId) ? item.roId.roName : "";
                const cpName = isRoIn(item.roId) ? item.roId.contactPersonName : "";
                let productId1 = null;
                if (item.productId && isProductIn(item.productId)) {
                    productId1 = item.productId;
                }
                const productId = item.productId._id;
                const itemCode = productId1 ? productId1.itemCode : 0;
                const itemDescription = productId1 ? productId1.itemDescription : "";
                const productName = productId1 ? productId1.productName : "";
                const categoryid = productId1 && productId1.categoryid ? productId1.categoryid._id : "";
                const subcategoryid = productId1 && productId1.subcategoryid ? productId1.subcategoryid._id : "";
                const categoryName = productId1 && productId1.categoryid ? productId1.categoryid.categoryName : "";
                const subCategoryName = productId1 && productId1.subcategoryid ? productId1.subcategoryid.subcategoryName : "";
                return {
                    _id,
                    roId,
                    productId,
                    qty,
                    date,
                    active,
                    roName,
                    cpName,
                    itemCode,
                    itemDescription,
                    productName,
                    categoryid,
                    subcategoryid,
                    categoryName,
                    subCategoryName,
                };
            });
            return data;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    async getRoInventoryList(req, addRoConsumptionDto) {
        try {
            const authInfo = await (0, jwt_helper_2.getAuthUserInfo)(req.headers);
            const ro = await this.roInventoryModel.aggregate([
                {
                    $match: { active: true, roId: ObjectId(addRoConsumptionDto.roId) }
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
RoConsumptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cgInventory_1.CgInventory.name)),
    __param(1, (0, mongoose_1.InjectModel)(roInventory_1.RoInventory.name)),
    __param(2, (0, mongoose_1.InjectModel)(roConsumption_1.RoConsumption.name)),
    __param(3, (0, mongoose_1.InjectModel)(silverProductMaster_1.SilverProduct.name)),
    __param(4, (0, mongoose_1.InjectModel)(roOrder_1.RoOrder.name)),
    __param(5, (0, mongoose_1.InjectModel)(cgOrder_1.CgOrder.name)),
    __param(6, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __param(7, (0, mongoose_1.InjectModel)(roMaster_1.RoMaster.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], RoConsumptionService);
exports.RoConsumptionService = RoConsumptionService;
;
//# sourceMappingURL=ro-consumption.service.js.map