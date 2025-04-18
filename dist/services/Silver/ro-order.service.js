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
exports.RoOrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const googleapis_1 = require("googleapis");
const ObjectId = require("mongoose").Types.ObjectId;
const users_entity_1 = require("../../entities/users.entity");
const roOrder_1 = require("../../entities/Silver/roOrder");
const cgOrder_1 = require("../../entities/Silver/cgOrder");
const silverProductMaster_1 = require("../../entities/Silver/silverProductMaster");
const roMaster_1 = require("../../entities/Silver/roMaster");
const roInventory_1 = require("../../entities/Silver/roInventory");
const cgInventory_1 = require("../../entities/Silver/cgInventory");
const roConsumption_1 = require("../../entities/Silver/roConsumption");
const cgConsumption_1 = require("../../entities/Silver/cgConsumption");
const jwt_helper_1 = require("../../common/utils/jwt.helper");
let RoOrderService = class RoOrderService {
    constructor(userModel, roInventoryModel, cgInventoryModel, silverProductModel, roConsumptionModel, cgConsumptionModel, roOrderModel, cgOrderModel, roMasterModel) {
        this.userModel = userModel;
        this.roInventoryModel = roInventoryModel;
        this.cgInventoryModel = cgInventoryModel;
        this.silverProductModel = silverProductModel;
        this.roConsumptionModel = roConsumptionModel;
        this.cgConsumptionModel = cgConsumptionModel;
        this.roOrderModel = roOrderModel;
        this.cgOrderModel = cgOrderModel;
        this.roMasterModel = roMasterModel;
        this.spreadsheetId = 'YOUR_SPREADSHEET_ID';
    }
    ;
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
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateCgInventory(productId, createdBy, updateQty) {
        try {
            let date = await (0, jwt_helper_1.dateFormate)(new Date());
            let findInventory = await this.cgInventoryModel.findOne({ productId: ObjectId(productId) });
            if (!findInventory) {
                throw new common_1.BadRequestException("Inventory not found");
            }
            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "BLACK";
            let onHandStock = findInventory.onHandStock - updateQty;
            let qualifiedDemand = findInventory.qualifiedDemand - updateQty;
            const openOrder = await this.getCgOpenOrder(productId);
            const currentDate = new Date();
            const thirteenWeeksAgo = new Date();
            thirteenWeeksAgo.setDate(currentDate.getDate() - 13 * 7);
            let checkOldInventoryExit = await this.cgInventoryModel.findOne({ createdAt: { $lte: thirteenWeeksAgo }, _id: findInventory._id });
            let tog = Number(findInventory.tog) ? Number(findInventory.tog) : findInventory.tog;
            let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
            let moq = Number(findInventory.moq);
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
                createdBy: createdBy,
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
                await this.cgOrderModel.deleteMany({
                    inventoryId: findInventory._id,
                    "sp.stage": "PENDING"
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
                    tog: tog,
                    uniqueNumber: uniqueNumber,
                    onHandStock: onHandStock,
                    qualifiedDemand: qualifiedDemand,
                    openOrder: openOrder,
                    netFlow: Math.abs(netFlow),
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
    async getIndianDate(date) {
        try {
            var currentTime = new Date(date);
            var options = {
                timeZone: 'Asia/Kolkata',
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            };
            var currentIndianTime = currentTime.toLocaleString('en-IN', options);
            return `${currentTime.getDate()}/${currentTime.getMonth() + 1}/${currentTime.getFullYear()} ${currentIndianTime}`;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async addDataInxlsxFile(dataArray, range) {
        try {
            const spreadsheetId = process.env.SPREADSHEETID;
            const auth = new googleapis_1.google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.CLIENT_EMAIL,
                    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
            const authToken = await auth.getClient();
            const sheet = googleapis_1.google.sheets({ version: 'v4', auth: authToken });
            async function readSheetData() {
                try {
                    const data = await sheet.spreadsheets.values.get({
                        spreadsheetId,
                        range: `${range}!A1:Z`,
                    });
                    const values = data.data.values;
                }
                catch (error) {
                    console.error("Error reading sheet data:", error.message);
                }
            }
            function isMatchAsync(obj2, orderID) {
                return obj2[0] === orderID;
            }
            async function writeMultipleSheetData(dataArray) {
                try {
                    const data = await sheet.spreadsheets.values.get({
                        spreadsheetId,
                        range: `${range}!A1:Z`,
                    });
                    const existingValues = data.data.values || [];
                    const uniqueOrderIDs = [];
                    const newData = dataArray.filter((newItem) => {
                        if (newItem.Order_ID && !uniqueOrderIDs.includes(newItem.Order_ID)) {
                            uniqueOrderIDs.push(newItem.Order_ID);
                            const isMatchArray = existingValues.map((obj2) => isMatchAsync(obj2, newItem.Order_ID));
                            const isMatch = isMatchArray.some((match) => match);
                            if (!isMatch) {
                                console.log("Adding new item:", newItem.Order_ID);
                                existingValues.push([
                                    newItem.Order_ID,
                                    newItem.Stage,
                                    newItem.Status,
                                    newItem.QTY,
                                    newItem.TOG,
                                    newItem.On_Hand_Stock,
                                    newItem.Unit,
                                    newItem.Open_Order,
                                    newItem.Qualified_Demand,
                                    newItem.CP_Name,
                                    newItem.Item_Code,
                                    newItem.Item_Description,
                                    newItem.Product_Name,
                                    newItem.Net_Flow,
                                    newItem.Contact_Person,
                                    newItem.City,
                                    newItem.State,
                                    newItem.Date,
                                    newItem.CP_Remark
                                ]);
                                return true;
                            }
                        }
                        return false;
                    });
                    if (newData.length === 0) {
                        console.log("No new data to add.");
                        return;
                    }
                    const numRows = existingValues.length;
                    const startRow = numRows;
                    const values = newData.map((body, index) => [
                        body.Order_ID,
                        body.Stage,
                        body.Status,
                        body.QTY,
                        body.TOG,
                        body.On_Hand_Stock,
                        body.Unit,
                        body.Open_Order,
                        body.Qualified_Demand,
                        body.CP_Name,
                        body.Item_Code, ,
                        body.Item_Description,
                        body.Product_Name,
                        body.Net_Flow,
                        body.Contact_Person,
                        body.City,
                        body.State,
                        body.Date,
                        body.CP_Remark
                    ]);
                    const newRange = `Main!A${startRow}:${startRow + dataArray.length}`;
                    const resource = {
                        values: [...values]
                    };
                    const response = await sheet.spreadsheets.values.update({
                        spreadsheetId,
                        range: newRange,
                        valueInputOption: "USER_ENTERED",
                        resource,
                    });
                    console.log("Sheet updated successfully");
                    readSheetData();
                }
                catch (error) {
                    console.error("Error updating sheet:", error.message);
                }
            }
            writeMultipleSheetData(dataArray);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getAllOrder(paginationDto, req) {
        var _a;
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const user = await this.userModel.findOne({ _id: ObjectId(authInfo._id), userType: "cg" });
            let productObj = {};
            let sortFields = {};
            let cpObj = {};
            if (user) {
                const units = (_a = user === null || user === void 0 ? void 0 : user.units) !== null && _a !== void 0 ? _a : [];
                const productIds = await this.silverProductModel.find({ unitid: { $in: units }, active: true });
                let arr = productIds ? productIds.map((item) => item._id) : [];
                productObj = { productId: { $in: arr } };
            }
            const cpIds = await this.roMasterModel.find({ isActive: true });
            let cpArr = cpIds ? cpIds.map((item) => item._id) : [];
            cpObj = { roId: { $in: cpArr } };
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const orderByFields = paginationDto.orderBy || ["createdAt"];
            let condition = {};
            if (paginationDto.roId) {
                condition = {
                    roId: ObjectId(paginationDto.roId),
                };
            }
            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false };
            }
            let orderCondition = {};
            if (paginationDto.flag == "ORDER_RECOMMENDATION") {
                orderCondition = {
                    $and: [
                        { "cg.status": true },
                        { "recommendation.status": true },
                        { "recommendation.stage": "RECOMMENDATION" },
                        { "cg.stage": "PENDING" },
                    ],
                };
            }
            else if (paginationDto.flag == "HO_ACCEPT") {
                orderCondition = {
                    $and: [{ "cg.status": true }, { "cg.stage": "ACCEPT" }, { "wip.status": true }, { "wip.stage": "PENDING" }],
                };
            }
            else if (paginationDto.flag == "WIP") {
                orderCondition = {
                    $and: [{ "wip.status": true }, { "wip.stage": "ACCEPT" }],
                };
            }
            else if (paginationDto.flag == "IN_TRANSIT") {
                orderCondition = {
                    $and: [
                        { "in_trasit.status": true },
                        { "in_trasit.stage": "PENDING" },
                    ],
                };
            }
            else if (paginationDto.flag == "GRN") {
                orderCondition = {
                    $and: [
                        { "in_trasit.status": true },
                        { "grn.status": true },
                        { "in_trasit.stage": "ACCEPT" },
                    ],
                };
            }
            else {
                orderCondition = {};
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
            const order = await this.roOrderModel
                .aggregate([
                {
                    $match: cpObj
                },
                {
                    $match: activeCondition,
                },
                {
                    $match: condition,
                },
                {
                    $match: orderCondition,
                },
                {
                    $lookup: {
                        from: "romasters",
                        localField: "roId",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    roName: 1,
                                    contactPersonName: 1,
                                    city: 1,
                                    state: 1,
                                },
                            },
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
                            {
                                $project: {
                                    _id: 1,
                                    itemCode: 1,
                                    itemDescription: 1,
                                    productName: 1,
                                    categoryid: 1,
                                    subcategoryid: 1,
                                    finalPrice: 1,
                                    groupid: 1
                                },
                            },
                        ],
                        as: "productInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvergroups",
                        localField: "productInfo.groupid",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, groupCode: 1, group: 1 } }
                        ],
                        as: "groupInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silvercategories",
                        localField: "productInfo.categoryid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, categoryName: 1 } }],
                        as: "categoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silversubcategories",
                        localField: "productInfo.subcategoryid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, subcategoryName: 1 } }],
                        as: "subcategoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "roinventories",
                        localField: "inventoryId",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    tog: 1,
                                    netFlow: 1,
                                    onHandStock: 1,
                                    qualifiedDemand: 1,
                                    openOrder: 1,
                                    leadTime: 1,
                                    moq: 1,
                                    flag: 1,
                                },
                            },
                        ],
                        as: "inventoryInfo",
                    },
                },
                {
                    $project: {
                        roId: { $ifNull: [{ $first: "$roInfo._id" }, ""], },
                        roName: { $ifNull: [{ $first: "$roInfo.roName" }, ""] },
                        group: { $ifNull: [{ $first: "$groupInfo.group" }, ""] },
                        contactPersonName: { $ifNull: [{ $first: "$roInfo.contactPersonName" }, "",], },
                        city: { $ifNull: [{ $first: "$roInfo.city" }, ""] },
                        state: { $ifNull: [{ $first: "$roInfo.state" }, ""], },
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""], },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""], },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""], },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""], },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""], },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""], },
                        qty: { $ifNull: ["$qty", 0] },
                        tog: { $ifNull: [{ $floor: { $first: "$inventoryInfo.tog" } }, 0] },
                        flags: { $ifNull: [{ $first: "$inventoryInfo.flag" }, "BLACK"], },
                        status: { $ifNull: [{ $first: "$inventoryInfo.flag" }, "BLACK"], },
                        netFlow: { $ifNull: [{ $first: "$inventoryInfo.netFlow" }, 0] },
                        onHandStock: { $ifNull: [{ $first: "$inventoryInfo.onHandStock" }, 0], },
                        qualifiedDemand: { $ifNull: [{ $first: "$inventoryInfo.qualifiedDemand" }, 0], },
                        openOrder: { $ifNull: [{ $first: "$inventoryInfo.openOrder" }, 0], },
                        recommendation: "$recommendation",
                        cg: "$cg",
                        wip: "$wip",
                        in_trasit: "$in_trasit",
                        inventoryInfo: "$inventoryInfo",
                        uniqueNumber: { $ifNull: ["$uniqueNumber", 0] },
                        createdAt: { $ifNull: ["$createdAt", 0] },
                        oldTOg: { $ifNull: ["$tog", 0] },
                        oldOpenOrder: { $ifNull: ["$openOrder", 0] },
                        oloOnHandStock: { $ifNull: ["$onHandStock", 0] },
                        OldNetFlow: { $ifNull: ["$netFlow", 0] },
                        oldQualifiedDemand: { $ifNull: ["$qualifiedDemand", 0] },
                        recommendedQty: { $ifNull: ["$recommendation.qty", 0] },
                        acceptedBySpQty: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: { $ifNull: ["$cg.qty", 0] },
                                else: 0
                            }
                        },
                        wipQty: {
                            $cond: {
                                if: { $eq: ["$wip.stage", "ACCEPT"] },
                                then: { $ifNull: ["$wip.qty", 0] },
                                else: "",
                            }
                        },
                        isPartialDispatch: {
                            $cond: {
                                if: { $or: [{ $eq: ["$cg.stage", "PENDING"] }] },
                                then: "",
                                else: { $ifNull: ["$wip.isPartialDispatch", false] },
                            }
                        },
                        in_trasitQty: {
                            $cond: {
                                if: { $eq: ["$wip.isPartialDispatch", true] },
                                then: { $ifNull: ["$wip.partialDispatchQty", 0] },
                                else: { $ifNull: ["$wip.qty", 0] },
                            }
                        },
                        recommendedDate: { $ifNull: ["$recommendation.createdAt", ""] },
                        recommendedDate1: {
                            $ifNull: [{
                                    $dateToString: {
                                        format: "%d-%m-%Y",
                                        date: {
                                            $dateFromString: {
                                                dateString: "$recommendation.createdAt",
                                                format: "%Y-%m-%d %H:%M:%S"
                                            }
                                        }
                                    }
                                }, ""]
                        },
                        spDate: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: { $ifNull: ["$cg.createdAt", ""] },
                                else: "",
                            }
                        },
                        dateRange: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: {
                                    $let: {
                                        vars: {
                                            dateParts: {
                                                $dateToParts: {
                                                    date: {
                                                        $convert: {
                                                            input: "$cg.createdAt",
                                                            to: "date",
                                                            onError: new Date(0),
                                                            onNull: new Date(0)
                                                        }
                                                    },
                                                    timezone: "UTC"
                                                }
                                            }
                                        },
                                        in: {
                                            $dateFromParts: {
                                                year: "$$dateParts.year",
                                                month: "$$dateParts.month",
                                                day: "$$dateParts.day",
                                                hour: 0,
                                                minute: 0,
                                                second: 0,
                                                millisecond: 0,
                                                timezone: "UTC"
                                            }
                                        }
                                    }
                                },
                                else: ""
                            }
                        },
                        spDate1: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: {
                                    $dateToString: {
                                        format: "%d-%m-%Y",
                                        date: {
                                            $dateFromString: {
                                                dateString: "$cg.createdAt",
                                                format: "%Y-%m-%d %H:%M:%S"
                                            }
                                        }
                                    }
                                },
                                else: ""
                            }
                        },
                        wipDate: {
                            $cond: {
                                if: { $eq: ["$wip.stage", "ACCEPT"] },
                                then: { $ifNull: ["$cg.createdAt", ""] },
                                else: "",
                            }
                        },
                        dispatchDate: {
                            $cond: {
                                if: { $eq: ["$wip.stage", "ACCEPT"] },
                                then: { $ifNull: ["$wip.createdAt", ""] },
                                else: "",
                            }
                        },
                        spAcceptanceDelayDays: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: { $ifNull: [{ $divide: [{ $subtract: [{ $toDate: "$cg.createdAt" }, { $toDate: "$recommendation.createdAt" }] }, 1000 * 60 * 60 * 24] }, 0] },
                                else: "",
                            }
                        },
                        actualLeadTime: {
                            $cond: {
                                if: { $eq: ["$wip.stage", "ACCEPT"] },
                                then: { $ifNull: [{ $divide: [{ $subtract: [{ $toDate: "$wip.createdAt" }, { $toDate: "$cg.createdAt" }] }, 1000 * 60 * 60 * 24] }, 0] },
                                else: "",
                            }
                        },
                        newField: {
                            $concat: ["REP", " ", { $toString: "$uniqueNumber" }]
                        },
                        proRecommendationValue: {
                            $ifNull: [
                                {
                                    $multiply: [
                                        { $ifNull: [{ $toDouble: "$qty" }, 1] },
                                        { $ifNull: [{ $toDouble: { $first: "$productInfo.finalPrice" } }, 1] }
                                    ]
                                },
                                1
                            ]
                        },
                    },
                },
                { $match: filter },
                {
                    $match: {
                        $or: [
                            { roName: { $regex: paginationDto.search, $options: "i" }, },
                            { contactPersonName: { $regex: paginationDto.search, $options: "i", }, },
                            { city: { $regex: paginationDto.search, $options: "i" } },
                            { state: { $regex: paginationDto.search, $options: "i" } },
                            { itemDescription: { $regex: paginationDto.search, $options: "i", }, },
                            { itemDescription: { $eq: paginationDto.search } },
                            { itemCode: { $regex: paginationDto.search, $options: "i" } },
                            { productName: { $regex: paginationDto.search, $options: "i" }, },
                            { categoryName: { $regex: paginationDto.search, $options: "i" }, },
                            { subCategoryName: { $eq: parseInt(paginationDto.search) } },
                            { qty: { $eq: parseInt(paginationDto.search) } },
                            { tog: { $eq: parseInt(paginationDto.search) } },
                            { uniqueNumber: { $eq: parseInt(paginationDto.search) } },
                            { netFlow: { $eq: parseInt(paginationDto.search) } },
                            { onHandStock: { $eq: parseInt(paginationDto.search) } },
                            { qualifiedDemand: { $eq: parseInt(paginationDto.search) } },
                            { recommendedQty: { $eq: parseInt(paginationDto.search) } },
                            { recQtyAndOrdQtyDiff: { $eq: parseInt(paginationDto.search) } },
                            { city: { $regex: paginationDto.search, $options: "i" }, },
                            { state: { $regex: paginationDto.search, $options: "i" }, },
                            { createdAt: { $regex: paginationDto.search, $options: "i" }, },
                            { newField: { $regex: paginationDto.search, $options: "i" }, },
                        ],
                    },
                },
                {
                    $facet: {
                        paginate: [
                            { $count: "totalDocs" },
                            {
                                $addFields: {
                                    recordPerPage: recordPerPage,
                                    currentPage: currentPage,
                                },
                            },
                        ],
                        docs: [
                            { $sort: { [orderByFields[0]]: 1 } },
                            {
                                $addFields: {
                                    customOrder: {
                                        $switch: {
                                            branches: [
                                                { case: { $eq: ["$status", "BLACK"] }, then: 1 },
                                                { case: { $eq: ["$status", "RED"] }, then: 2 },
                                                { case: { $eq: ["$status", "YELLOW"] }, then: 3 },
                                                { case: { $eq: ["$status", "GREEN"] }, then: 4 },
                                                { case: { $eq: ["$status", "WHIGHT"] }, then: 5 },
                                            ],
                                        },
                                    },
                                },
                            },
                            {
                                $sort: { customOrder: 1 },
                            },
                            { $skip: (currentPage - 1) * recordPerPage },
                            { $limit: recordPerPage },
                        ],
                    },
                },
            ])
                .exec();
            if (!order || !order[0]) {
                throw new common_1.BadRequestException("Data Not Found");
            }
            order[0].docs.forEach((ele) => {
                if (ele.in_trasit.status === true) {
                    ele["stage"] = ele.in_trasit.stage;
                }
                else if (ele.wip.status === true) {
                    ele["stage"] = ele.wip.stage;
                }
                else if (ele.cg.status === true) {
                    ele["stage"] = ele.cg.stage;
                }
                else if (ele.recommendation.status === true) {
                    ele["stage"] = ele.recommendation.stage;
                }
            });
            return order;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getPartialOrderInfo(uniqueNumber) {
        try {
            const maxPartialUniqueNumberResult = await this.roOrderModel.aggregate([
                {
                    $match: {
                        uniqueNumber: uniqueNumber,
                        "wip.isPartialDispatch": true
                    }
                },
                {
                    $group: {
                        _id: "$uniqueNumber",
                        maxPartialUniqueNumber: { $max: "$partialUniqueNumber" }
                    }
                }
            ]);
            const maxPartialUniqueNumber = maxPartialUniqueNumberResult.length > 0 ? maxPartialUniqueNumberResult[0].maxPartialUniqueNumber : null;
            let order = [];
            order = await this.roOrderModel.aggregate([
                {
                    $match: {
                        uniqueNumber: uniqueNumber,
                        "wip.isPartialDispatch": true,
                        partialUniqueNumber: { $ne: maxPartialUniqueNumber }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        uniqueNumber: 1,
                        partialUniqueNumber: 1,
                        wip: 1,
                        remainingQty: "$wip.qty"
                    }
                }
            ]);
            return order;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getOrderInfo(id) {
        try {
            const order = await this.roOrderModel
                .aggregate([
                { $match: { _id: ObjectId(id) } },
                {
                    $lookup: {
                        from: "romasters",
                        localField: "roId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, contactPersonName: 1, leadTime: 1, roName: 1 } },
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
                            {
                                $project: {
                                    _id: 1,
                                    itemCode: 1,
                                    itemDescription: 1,
                                    productName: 1,
                                    categoryid: 1,
                                    subcategoryid: 1,
                                    moq: 1,
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
                        pipeline: [{ $project: { _id: 1, categoryName: 1 } }],
                        as: "categoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silversubcategories",
                        localField: "productInfo.subcategoryid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, subcategoryName: 1 } }],
                        as: "subcategoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "roinventories",
                        localField: "inventoryId",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    tog: 1,
                                    netFlow: 1,
                                    onHandStock: 1,
                                    qualifiedDemand: 1,
                                    openOrder: 1,
                                    leadTime: 1,
                                    moq: 1,
                                },
                            },
                        ],
                        as: "inventoryInfo",
                    },
                },
                {
                    $project: {
                        roId: "$roId",
                        productId: "$productId",
                        inventoryId: "$inventoryId",
                        qty: "$qty",
                        recommendation: "$recommendation",
                        cg: "$cg",
                        wip: "$wip",
                        in_trasit: "$in_trasit",
                        createdAt: "$createdAt",
                        createdBy: "$createdBy",
                        tog: { $ifNull: [{ $floor: { $first: "$inventoryInfo.tog" } }, 0] },
                        status: { $ifNull: [{ $first: "$inventoryInfo.flag" }, "BLACK"] },
                        openOrder: { $ifNull: [{ $first: "$inventoryInfo.openOrder" }, 0] },
                        moq: { $ifNull: [{ $first: "$inventoryInfo.moq" }, ""] },
                        leadTime: { $ifNull: [{ $first: "$inventoryInfo.leadTime" }, 0] },
                        stockUpWeeks: { $ifNull: [{ $first: "$inventoryInfo.stockUpWeeks" }, 0] },
                        growthFactor: { $ifNull: [{ $first: "$inventoryInfo.growthFactor" }, 0] },
                        netFlow: { $ifNull: [{ $first: "$inventoryInfo.netFlow" }, 0] },
                        unit: { $ifNull: [{ $first: "$unitInfo.unit" }, 0] },
                        onHandStock: { $ifNull: [{ $first: "$inventoryInfo.onHandStock" }, 0] },
                        qualifiedDemand: { $ifNull: [{ $first: "$inventoryInfo.qualifiedDemand" }, 0] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        roName: { $ifNull: [{ $first: "$roInfo.roName" }, ""] },
                        uniqueNumber: { $ifNull: ["$uniqueNumber", 0] },
                    },
                },
            ])
                .exec();
            if (!order || !order[0]) {
                throw new common_1.BadRequestException("Data Not Found");
            }
            if (Array.isArray(order) && order.length > 0) {
                let mapData = await Promise.all(order.map(async (ele) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            ele["partialOrder"] = await this.getPartialOrderInfo(ele.uniqueNumber);
                            resolve(ele);
                        }
                        catch (err) {
                            console.log("mappedData err:", err);
                            resolve(ele);
                        }
                    });
                }));
                return order;
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async updateOrder(id, updateOrderDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const findOrder = await this.roOrderModel.findOne({ _id: ObjectId(id) });
            if (!findOrder) {
                throw new common_1.BadRequestException("order not exist");
            }
            let inventory = await this.roInventoryModel.findOne({ _id: findOrder.inventoryId });
            let obj = {};
            let status = false;
            let grn = false;
            let condition = false;
            let isCgDispatchQty = false;
            if (updateOrderDto.stage == "ACCEPT") {
                status = true;
            }
            let date = await (0, jwt_helper_1.dateFormate)(new Date());
            let qty = updateOrderDto.qty ? updateOrderDto.qty : findOrder.qty;
            if (findOrder.in_trasit.status == true && findOrder.in_trasit.stage == "PENDING") {
                grn = true;
                obj = {
                    "grn.status": status,
                    "grn.stage": updateOrderDto.stage,
                    "in_trasit.stage": updateOrderDto.stage,
                    "in_trasit.qty": qty,
                    "grn.qty": qty,
                    qty: qty,
                    "in_trasit.createdAt": date,
                    "grn.createdAt": date,
                };
            }
            else if (findOrder.wip.status == true && findOrder.wip.stage == "PENDING") {
                if (updateOrderDto.isChangeQty) {
                    await this.roInventoryModel.findByIdAndUpdate({ _id: findOrder._id }, {
                        $set: {
                            "qty": updateOrderDto.qty,
                            "wip.qty": updateOrderDto.qty,
                            "wip.createdAt": date,
                            "wip.isChangeQty": true
                        }
                    });
                    obj = {
                        qty: updateOrderDto.qty,
                        "wip.qty": updateOrderDto.qty,
                        "wip.createdAt": date,
                        "wip.isChangeQty": true
                    };
                }
                else {
                    condition = true;
                    isCgDispatchQty = true;
                    const checkCgStock = await this.cgInventoryModel.findOne({ productId: findOrder.productId });
                    if (checkCgStock) {
                        if (updateOrderDto.changeQty > checkCgStock.onHandStock && updateOrderDto.partcialDispatch == true) {
                            throw new common_1.BadRequestException("Stock is insufficient. Dispatch quantity should not be more than on hand stock.");
                        }
                        else if (qty > checkCgStock.onHandStock && updateOrderDto.partcialDispatch == false) {
                            throw new common_1.BadRequestException("Stock is insufficient. Dispatch quantity should not be more than on hand stock.");
                        }
                    }
                    else {
                        throw new common_1.BadRequestException("Cg inventory not exist");
                    }
                    if (findOrder.wip.isPartialDispatch) {
                        obj = {
                            qty: qty,
                            "wip.qty": qty,
                            "wip.createdAt": date,
                            "in_trasit.status": status,
                            "wip.partialDispatchQty": 0,
                            "wip.stage": updateOrderDto.stage,
                        };
                    }
                    else {
                        obj = {
                            "in_trasit.status": status,
                            "wip.stage": updateOrderDto.stage,
                            qty: qty,
                            "wip.qty": qty,
                            "wip.createdAt": date,
                        };
                    }
                }
            }
            else if (findOrder.cg.status == true && findOrder.cg.stage == "PENDING") {
                obj = {
                    "wip.status": status,
                    "cg.qty": qty,
                    "cg.stage": updateOrderDto.stage,
                    qty: qty,
                    "cg.createdAt": date,
                };
                condition = true;
                await this.roOrderModel.findByIdAndUpdate(findOrder._id, {
                    tog: inventory.tog,
                    onHandStock: inventory.onHandStock,
                    openOrder: inventory.openOrder,
                    qualifiedDemand: inventory.qualifiedDemand,
                    netFlow: inventory.netFlow
                }, { new: true, useFindAndModify: false });
            }
            if (updateOrderDto.partcialDispatch && updateOrderDto.partcialDispatch == true && updateOrderDto.isChangeQty == false) {
                let changeQty = updateOrderDto.changeQty;
                const maxPartialUniqueNumberResult = await this.roOrderModel.aggregate([
                    {
                        $match: {
                            uniqueNumber: findOrder.uniqueNumber,
                            "wip.isPartialDispatch": true
                        }
                    },
                    {
                        $group: {
                            _id: "$uniqueNumber",
                            maxPartialUniqueNumber: { $max: "$partialUniqueNumber" }
                        }
                    }
                ]);
                const maxPartialUniqueNumber = maxPartialUniqueNumberResult.length > 0 ? maxPartialUniqueNumberResult[0].maxPartialUniqueNumber : null;
                let order11 = [];
                order11 = await this.roOrderModel.aggregate([
                    {
                        $match: {
                            uniqueNumber: findOrder.uniqueNumber,
                            "wip.isPartialDispatch": true,
                            partialUniqueNumber: { $ne: maxPartialUniqueNumber }
                        }
                    },
                    {
                        $unwind: "$wip"
                    },
                    {
                        $match: {
                            "wip.isPartialDispatch": true
                        }
                    },
                    {
                        $group: {
                            _id: "$uniqueNumber",
                            totalPartialDispatchQty: { $sum: "$wip.partialDispatchQty" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            uniqueNumber: "$_id",
                            totalPartialDispatchQty: 1
                        }
                    }
                ]);
                let sumPartialQty = order11.length > 0 ? order11[0].totalPartialDispatchQty : 0;
                let finalQty = findOrder.cg.qty - (sumPartialQty + changeQty);
                if (findOrder.wip.isChangeQty) {
                    finalQty = findOrder.wip.qty - (sumPartialQty + changeQty);
                }
                let newObj = {
                    "in_trasit.status": true,
                    "in_trasit.stage": "PENDING",
                    "wip.stage": updateOrderDto.stage,
                    changeQty: changeQty,
                    "wip.partialDispatchQty": changeQty,
                    "wip.qty": finalQty,
                    "wip.createdAt": date,
                    "wip.isPartialDispatch": true,
                    $set: { "in_trasit.isPartialDispatch": true }
                };
                await this.roOrderModel.findByIdAndUpdate(findOrder._id, Object.assign(Object.assign({}, newObj), { qty: changeQty }), { new: true, useFindAndModify: false });
                let afterOrder = await this.roOrderModel.findOne({ _id: findOrder._id });
                let findUniqueNumber = await this.roOrderModel.find({ uniqueNumber: afterOrder.uniqueNumber }).sort({ partialUniqueNumber: -1 }).exec();
                let partialUniqueNumber = findUniqueNumber[0].partialUniqueNumber > 0 ? findUniqueNumber[0].partialUniqueNumber : 1;
                if (partialUniqueNumber >= 1) {
                    partialUniqueNumber = findUniqueNumber[0].partialUniqueNumber + 1;
                }
                if (Number(qty - changeQty) != 0 && qty >= changeQty) {
                    const test = await new this.roOrderModel({
                        roId: afterOrder.roId,
                        productId: afterOrder.productId,
                        qty: Number(qty - changeQty) ? Number(qty - changeQty) : 0,
                        inventoryId: afterOrder.inventoryId,
                        status: afterOrder.status,
                        createdAt: date,
                        uniqueNumber: afterOrder.uniqueNumber,
                        recommendation: afterOrder.recommendation,
                        cg: afterOrder.cg,
                        "wip.status": true,
                        "wip.stage": "PENDING",
                        "wip.createdAt": afterOrder.wip.createdAt,
                        "wip.qty": Number(qty - changeQty) ? Number(qty - changeQty) : 0,
                        "wip.isPartialDispatch": true,
                        "wip.partialDispatchQty": changeQty,
                        partialUniqueNumber: partialUniqueNumber
                    }).save();
                }
                else {
                    await this.roOrderModel.findByIdAndUpdate(findOrder._id, Object.assign(Object.assign({}, obj), { qty: qty, "wip.partialDispatchQty": qty }), { new: true, useFindAndModify: false });
                }
            }
            else {
                await this.roOrderModel.findByIdAndUpdate(findOrder._id, Object.assign(Object.assign({}, obj), { qty: qty }), { new: true, useFindAndModify: false });
            }
            let findInventory = await this.roInventoryModel.findOne({ _id: findOrder.inventoryId });
            let findProduct = await this.silverProductModel.findOne({
                inventoryId: findOrder.productId,
            });
            let openOrder = findInventory.openOrder;
            let onHandStock = findInventory.onHandStock;
            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "WHIGHT";
            if (grn) {
                onHandStock = updateOrderDto.qty > 0 ? Math.abs(Number(findInventory.onHandStock) + Number(updateOrderDto.qty)) : findInventory.onHandStock;
                const openOrder = await this.getOpenOrder(findInventory.roId, findInventory.productId);
                const order_recommentdation = await this.roOrderModel.aggregate([
                    {
                        $match: {
                            active: true,
                            $and: [
                                {
                                    roId: findInventory.roId,
                                    productId: findInventory.productId
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
                let netFlow = Number(onHandStock + openOrder - findInventory.qualifiedDemand);
                let moq = Number(findInventory.moq);
                let tog_net = await Math.abs(Number(findInventory.tog - netFlow));
                if (netFlow >= findInventory.tog) {
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
                    orderRecommendationStatus = Math.abs((Number(orderRecommendation) * 100) / findInventory.tog);
                }
                let onHandStatusNumber = Math.abs((Number(onHandStock) * 100) / findInventory.tog);
                if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                    onHandStatus = 0;
                }
                else {
                    onHandStatus = onHandStatusNumber;
                }
                flag = await (0, jwt_helper_1.flagFunction)(findInventory.tog, onHandStock);
                let inventoryObject = {
                    openOrder: openOrder,
                    netFlow: Math.abs(netFlow),
                    moq: moq,
                    orderRecommendation: orderRecommendation,
                    orderRecommendationStatus: orderRecommendationStatus,
                    onHandStatus: onHandStatus,
                    flag: flag,
                    onHandStock: onHandStock,
                };
                await this.roInventoryModel.findByIdAndUpdate({ _id: findOrder.inventoryId }, inventoryObject, { new: true, useFindAndModify: false });
                if (orderRecommendation >= 0) {
                    const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                    let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                    await this.roOrderModel.deleteMany({
                        inventoryId: findOrder.inventoryId,
                        "cg.stage": "PENDING"
                    });
                    let order = new this.roOrderModel({
                        roId: findOrder.roId,
                        productId: findOrder.productId,
                        qty: Math.abs(Number(orderRecommendation)),
                        inventoryId: findOrder.inventoryId,
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
                    await this.roOrderModel.updateMany({
                        inventoryId: findOrder.inventoryId,
                        "cg.stage": "PENDING"
                    }, { active: false });
                }
            }
            else if (condition) {
                if (isCgDispatchQty) {
                    if (updateOrderDto.partcialDispatch) {
                        qty = updateOrderDto.changeQty;
                    }
                    await this.updateCgInventory(findInventory.productId, authInfo._id, qty);
                    const consumption = new this.cgConsumptionModel({
                        qty: qty,
                        createdAt: date,
                        createdBy: authInfo._id,
                        inventoryId: findInventory._id,
                        roId: findOrder.roId,
                        productId: findInventory.productId,
                    });
                    consumption.save();
                }
                onHandStock = findInventory.onHandStock;
                const order_recommentdation = await this.roOrderModel.aggregate([
                    {
                        $match: {
                            active: true,
                            $and: [
                                {
                                    roId: findInventory.roId,
                                    productId: findInventory.productId
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
                const openOrder = await this.getOpenOrder(findInventory.roId, findInventory.productId) > 0 ? await this.getOpenOrder(findInventory.roId, findInventory.productId) : findInventory.openOrder;
                let totalOrder = Number(order) + openOrder + findInventory.onHandStock;
                let netFlow = Number(findInventory.onHandStock + Number(openOrder) - findInventory.qualifiedDemand);
                let moq = Number(findInventory.moq);
                let tog_net = await Math.abs(Number(findInventory.tog - netFlow));
                if (netFlow >= findInventory.tog) {
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
                    orderRecommendationStatus = Math.abs((Number(orderRecommendation) * 100) / findInventory.tog);
                }
                let onHandStatusNumber = Math.abs((Number(onHandStock) * 100) / findInventory.tog);
                if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                    onHandStatus = 0;
                }
                else {
                    onHandStatus = onHandStatusNumber;
                }
                flag = await (0, jwt_helper_1.flagFunction)(findInventory.tog, onHandStock);
                let inventoryObject = {
                    openOrder: openOrder,
                    netFlow: Math.abs(netFlow),
                    moq: moq,
                    orderRecommendation: orderRecommendation,
                    orderRecommendationStatus: orderRecommendationStatus,
                    onHandStatus: onHandStatus,
                    flag: flag,
                    onHandStock: onHandStock,
                };
                await this.roInventoryModel.findByIdAndUpdate({ _id: findOrder.inventoryId }, inventoryObject, { new: true, useFindAndModify: false });
                if (orderRecommendation >= 0) {
                    const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                    let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                    await this.roOrderModel.deleteMany({ inventoryId: findOrder.inventoryId, "cg.stage": "PENDING" });
                    let order1 = new this.roOrderModel({
                        roId: findOrder.roId,
                        productId: findOrder.productId,
                        qty: Math.abs(Number(orderRecommendation)),
                        inventoryId: findOrder.inventoryId,
                        status: flag,
                        createdAt: date,
                        uniqueNumber: uniqueNumber,
                        "recommendation.qty": Number(orderRecommendation),
                        "cg.qty": Number(orderRecommendation),
                        "recommendation.createdAt": date,
                        "cg.createdAt": date,
                    });
                    order1.save();
                }
                else if (orderRecommendation == 0) {
                    await this.roOrderModel.updateMany({ inventoryId: findOrder.inventoryId, "cg.stage": "PENDING" }, { active: false });
                }
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async dashBoardOrder(dashboardOrderDto, req) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            const user = await this.userModel.findOne({ _id: ObjectId(authInfo._id), userType: "cg" });
            let cpObj = {};
            let condition = {};
            const cpIds = await this.roMasterModel.find({ isActive: true });
            let cpArr = cpIds ? cpIds.map((item) => item._id) : [];
            cpObj = { roId: { $in: cpArr } };
            let activeCondition = { active: true };
            if (dashboardOrderDto.roId) {
                condition = { roId: ObjectId(dashboardOrderDto.roId) };
            }
            if (dashboardOrderDto.active == false) {
                activeCondition = { active: false };
            }
            const order = await this.roOrderModel
                .aggregate([
                {
                    $match: cpObj
                },
                { $match: activeCondition },
                { $match: condition },
                {
                    $group: {
                        _id: null,
                        all: {
                            $sum: { $cond: [{ $eq: ["$active", true] }, 1, 0] },
                        },
                        GRN: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ["$in_trasit.status", true] },
                                            { $eq: ["$grn.status", true] },
                                            { $eq: ["$in_trasit.stage", "ACCEPT"] },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        IN_TRANSIT: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ["$in_trasit.status", true] },
                                            { $eq: ["$grn.status", false] },
                                            { $eq: ["$in_trasit.stage", "PENDING"] },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        HO_ACCEPT: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ["$wip.status", true] },
                                            { $eq: ["$wip.stage", "PENDING"] },
                                            { $eq: ["$cg.status", true] },
                                            { $eq: ["$cg.stage", "ACCEPT"] },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        wip: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ["$wip.status", true] },
                                            { $eq: ["$wip.stage", "ACCEPT"] },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        order_recommentdation: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ["$cg.status", true] },
                                            { $eq: ["$cg.stage", "PENDING"] },
                                            { $eq: ["$recommendation.status", true] },
                                            { $eq: ["$recommendation.stage", "RECOMMENDATION"] },
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ])
                .exec();
            return order;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
    async getOrderDropDown(req, addRoIdInfo) {
        try {
            const authInfo = await (0, jwt_helper_1.getAuthUserInfo)(req.headers);
            let roObj = {};
            if (addRoIdInfo.roId) {
                roObj = { roId: ObjectId(addRoIdInfo.roId) };
            }
            const ro = await this.roOrderModel
                .aggregate([
                {
                    $match: roObj
                },
                {
                    $match: { active: true },
                },
                {
                    $lookup: {
                        from: "romasters",
                        localField: "roId",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    contactPersonName: 1,
                                    roName: 1,
                                    city: 1,
                                    state: 1,
                                },
                            },
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
                            {
                                $project: {
                                    _id: 1,
                                    itemCode: 1,
                                    itemDescription: 1,
                                    productName: 1,
                                    categoryid: 1,
                                    subcategoryid: 1,
                                    groupid: 1
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
                        pipeline: [{ $project: { _id: 1, categoryName: 1 } }],
                        as: "categoryInfo",
                    },
                },
                {
                    $lookup: {
                        from: "silversubcategories",
                        localField: "productInfo.subcategoryid",
                        foreignField: "_id",
                        pipeline: [{ $project: { _id: 1, subcategoryName: 1 } }],
                        as: "subcategoryInfo",
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
                    $lookup: {
                        from: "roinventories",
                        localField: "inventoryId",
                        foreignField: "_id",
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    tog: 1,
                                    netFlow: 1,
                                    onHandStock: 1,
                                    qualifiedDemand: 1,
                                    flag: 1,
                                    openOrder: 1,
                                },
                            },
                        ],
                        as: "inventoryInfo",
                    },
                },
                {
                    $project: {
                        roId: { $ifNull: [{ $first: "$roInfo._id" }, ""] },
                        roName: { $ifNull: [{ $first: "$roInfo.roName" }, ""] },
                        contactPersonName: { $ifNull: [{ $first: "$roInfo.contactPersonName" }, ""], },
                        city: { $ifNull: [{ $first: "$roInfo.city" }, ""] },
                        state: { $ifNull: [{ $first: "$roInfo.state" }, ""] },
                        itemCode: { $ifNull: [{ $first: "$productInfo.itemCode" }, 0] },
                        group: { $ifNull: [{ $first: "$groupInfo.group" }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""], },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        qty: { $ifNull: ["$qty", 0] },
                        tog: { $ifNull: [{ $floor: { $first: "$inventoryInfo.tog" } }, 0] },
                        status: { $ifNull: [{ $first: "$inventoryInfo.flag" }, "BLACK"] },
                        netFlow: { $ifNull: [{ $first: "$inventoryInfo.netFlow" }, 0] },
                        onHandStock: { $ifNull: [{ $first: "$inventoryInfo.onHandStock" }, 0] },
                        qualifiedDemand: { $ifNull: [{ $first: "$inventoryInfo.qualifiedDemand" }, 0] },
                        openOrder: { $ifNull: [{ $first: "$inventoryInfo.openOrder" }, 0] },
                        recommendation: "$recommendation",
                        createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        spDate: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: { $ifNull: ["$cg.createdAt", ""] },
                                else: "",
                            }
                        },
                        cg: "$cg",
                        wip: "$wip",
                        in_trasit: "$in_trasit",
                        grn: "$grn",
                        inventoryInfo: "$inventoryInfo",
                        uniqueNumber: { $ifNull: ["$uniqueNumber", 0] },
                        acceptedBySpQty: {
                            $cond: {
                                if: { $eq: ["$cg.stage", "ACCEPT"] },
                                then: { $ifNull: ["$cg.qty", 0] },
                                else: 0
                            }
                        },
                        recommendedDate: { $ifNull: ["$recommendation.createdAt", ""] },
                        recommendedQty: { $ifNull: ["$recommendation.qty", 0] },
                    },
                },
            ])
                .exec();
            if (!ro) {
                throw new common_1.BadRequestException("Data Not Found");
            }
            return ro;
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    }
    ;
};
RoOrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_entity_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(roInventory_1.RoInventory.name)),
    __param(2, (0, mongoose_1.InjectModel)(cgInventory_1.CgInventory.name)),
    __param(3, (0, mongoose_1.InjectModel)(silverProductMaster_1.SilverProduct.name)),
    __param(4, (0, mongoose_1.InjectModel)(roConsumption_1.RoConsumption.name)),
    __param(5, (0, mongoose_1.InjectModel)(cgConsumption_1.CgConsumption.name)),
    __param(6, (0, mongoose_1.InjectModel)(roOrder_1.RoOrder.name)),
    __param(7, (0, mongoose_1.InjectModel)(cgOrder_1.CgOrder.name)),
    __param(8, (0, mongoose_1.InjectModel)(roMaster_1.RoMaster.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], RoOrderService);
exports.RoOrderService = RoOrderService;
;
//# sourceMappingURL=ro-order.service.js.map