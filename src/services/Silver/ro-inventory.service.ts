import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
const ObjectId = require('mongoose').Types.ObjectId;
import { User, UserDocument } from '../../entities/users.entity';
import { RoOrder, RoOrderDocument } from '../../entities/Silver/roOrder';
import { CgOrder, CgOrderDocument } from '../../entities/Silver/cgOrder';
import { SilverProduct, SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { RoInventory, RoInventoryDocument } from '../../entities/Silver/roInventory';
import { CgInventory, CgInventoryDocument } from '../../entities/Silver/cgInventory';
import { RoConsumption, RoConsumptionDocument } from '../../entities/Silver/roConsumption';
import { CgConsumption, CgConsumptionDocument } from '../../entities/Silver/cgConsumption';
import { CgGrowthFactor, CgGrowthFactorDocument } from '../../entities/Silver/cggrowthFactorInfo';
import { RoMaster, RoMasterDocument } from '../../entities/Silver/roMaster';
import { getAuthUserInfo,monthDifference, dateFormate, flagFunction, multiSelectorFunction, calculateDateRangeForLYM, calculateDateRangeForCym, around } from 'src/common/utils/jwt.helper';
import { SearchDto } from 'src/dto/pagination-dto';
import { GetRoInventoryInfoDto } from '../../Silver/ro-inventory/dto/response-roInventory.dto';
import { AddRoIdInfo, ChangeTogDto,CreateRoInventoryDto, FilterPaginationRoInventoryDto, GetDashBoardRoInventoryInfo, ImportRoInventoryAndUpdateStockDto, ImportRoInventoryDto, UpdateRoInventoryDto, UpdateStatusRoInventoryDto, UpdateTogToggleDto, ViewotherRoInventoryDto } from '../../Silver/ro-inventory/dto/request-roInventroy.dto';

@Injectable()
export class RoInventoryService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(RoInventory.name) private roInventoryModel: Model<RoInventoryDocument>,
        @InjectModel(CgInventory.name) private cgInventoryModel: Model<CgInventoryDocument>,
        @InjectModel(RoConsumption.name) private roConsumptionModel: Model<RoConsumptionDocument>,
        @InjectModel(CgConsumption.name) private cgConsumptionModel: Model<CgConsumptionDocument>,
        @InjectModel(SilverProduct.name) private silverProductModel: Model<SilverProductDocument>,
        @InjectModel(RoOrder.name) private roOrderModel: Model<RoOrderDocument>,
        @InjectModel(CgOrder.name) private cgOrderModel: Model<CgOrderDocument>,
        @InjectModel(RoMaster.name) private roMasterModel: Model<RoMasterDocument>,
        @InjectModel(CgGrowthFactor.name) private cgGrowthFactorModel: Model<CgGrowthFactorDocument>,
    ) { }

    async UpdateRoInventory(togData,productId,roId) {
        try {
            let date = await dateFormate(new Date());
            let findInventory = await this.roInventoryModel.findOne({productId:ObjectId(productId),roId:ObjectId(roId)});

            let ro = await this.roMasterModel.findOne({_id: ObjectId(findInventory.roId)})
            if(ro == null){
                throw new BadRequestException("Ro not found")
            }

            if (!findInventory) {
                throw new BadRequestException("Inventory not found")
            }

            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "BLACK"
            let onHandStock = findInventory.onHandStock;
            let qualifiedDemand =findInventory.qualifiedDemand;
            let openOrder = await this.getOpenOrder(roId,productId);

            // For Tog
            let tog = Number(togData) ? Number(togData) : findInventory.tog
            // Fot netFlow 
            let netFlow = Number(onHandStock + openOrder-qualifiedDemand);
            // For Moq
            let moq =findInventory.moq;
            // For net orderRecommendation
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
                orderRecommendationStatus = 0
            } else {
                orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);
            }
            let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

            if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                onHandStatus = 0
            } else {
                onHandStatus = onHandStatusNumber
            }

            // For onHandStatus
            flag = await flagFunction(tog, onHandStock);
            let inventoryObject = {
                tog:tog,
                openOrder: openOrder,
                netFlow: Math.abs(netFlow),
                moq: moq,
                orderRecommendation: orderRecommendation,
                orderRecommendationStatus: orderRecommendationStatus,
                onHandStatus: onHandStatus,
                onHandStock: onHandStock,
                qualifiedDemand: qualifiedDemand,
                flag: flag,
            }
            await this.roInventoryModel.findByIdAndUpdate({ _id: findInventory._id }, { ...inventoryObject }, { new: true, useFindAndModify: false })
            if (orderRecommendation >= 0) {
                await this.roOrderModel.deleteMany({inventoryId: findInventory._id,"cg.stage": "PENDING"});

                const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;

                let order = new this.roOrderModel({
                    createdBy: findInventory.createdBy,
                    qty: Number(orderRecommendation),
                    inventoryId: findInventory._id,
                    roId: findInventory.roId,
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

            }else if (orderRecommendation == 0) {
                await this.roOrderModel.updateMany({
                    inventoryId: findInventory._id,
                    "cg.stage": "PENDING"
                }, { active: false });
            }

            const cgInventoryExist = await this.cgInventoryModel.findOne({productId:findInventory.productId})
            if(!cgInventoryExist){
               await this.createCgInventory(findInventory.productId,orderRecommendation,findInventory.createdBy);
            }else{
               await this.updateCgInventory(findInventory.productId,orderRecommendation,findInventory.createdBy);
            }
        }
        catch (e) {
          console.log(e)
        }
    };



    public async calculateRoSigma(productId):Promise<number>{
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

            let roSigma = roInventory.length > 0 ?roInventory[0].totalMultipliedByGrowthFactor:0

            return roSigma;
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    public async sumOfQualifiedDemand(productId): Promise<number> {
        try {
            
            let roInventory = await this.roInventoryModel.aggregate([
                { 
                    $match: { 
                        productId: ObjectId(productId), 
                        active: true, 
                        // "cg.stage": "PENDING", 
                        // "cg.status": true 
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
            ])
   
            let totalRecommendation =roInventory.length > 0 ? roInventory[0].totalOrderRecommendation:0;
            return totalRecommendation;
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    };

    public async getCgOpenOrder(productId): Promise<number> {
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
            return openOrder
        } catch (error) {
            return 0;
        }

    };

    public async getAvgWeeklyCgConsumption(productId): Promise<number> {
        try {
                
            let avgWeeklyConsumption ;
             
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
                    avgWeeklyConsumption = (totalConsumption[0].totalQty) / 13
    
                }
            } else {
                let findConsumption = await this.cgConsumptionModel.aggregate([
                    {
                        $match:
                            { productId: productId}
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
                
    } catch (e) {
        throw new InternalServerErrorException(e)
    }
    };


    public async updateCgData(authInfo){
        const roInventory = await this.roInventoryModel.aggregate([
            { 
                $group: { 
                    _id: "$productId"
                } 
            },
            {
                $project:{
                    productId:1
                }
            }
        ]);
        if(roInventory.length > 0){

            for(let inventory of roInventory){
                const cgInventoryExist = await this.cgInventoryModel.findOne({productId:inventory.productId})
                if(!cgInventoryExist){
                   await this.createCgInventory(inventory.productId,inventory.orderRecommendation,authInfo._id);
                }else{
                   await this.updateCgInventory(inventory.productId,inventory.orderRecommendation,authInfo._id);
                }
            }
        }
        
    }

    public async createCgInventory(productId,qualifiedDemand,createdBy){
        try {
            let date = await dateFormate(new Date());
            const findInventory = await this.cgInventoryModel.findOne({productId: ObjectId(productId)});

            if (!findInventory) {
          
            let orderRecommendation = 0;
            let onHandStatus = 0;
            let onHandStock = 0;
            const openOrder = 0;
            let flag = "BLACK";
            let roSigma = 0;
            let togRecommendation = 0;
            let tog = 0;
         
            // For lead time

            let plantLeadTime = 1;

            // For factor of safety and moq    

            // For netFlow 
            let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
            // For Moq
            let moq = 1;

            // For net orderRecommendation
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
                orderRecommendationStatus = 0
            } else {
                orderRecommendationStatus = Number(orderRecommendation) * 100 / tog
            }

            let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

            if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                onHandStatus = 0
            } else {
                onHandStatus = onHandStatusNumber
            }

            // For onHandStatus
            flag = await flagFunction(tog, onHandStock)

            let inventoryObject = {
                productId: productId,
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
            }

            const inventory = new this.cgInventoryModel(inventoryObject);
            if (await inventory.save()) {
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
                // return new GetCgInventoryInfoDto(inventory)
            }
        }
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    
    public async updateCgInventory(productId,qualifiedDemandData,createdBy){
        try {
            let date = await dateFormate(new Date());
            let findInventory = await this.cgInventoryModel.findOne({productId: ObjectId(productId)});
            let silverProduct = await this.silverProductModel.findOne({_id: ObjectId(productId)});

            if (!findInventory) {
                throw new BadRequestException("Inventory not found")
            }
            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "BLACK"
            let onHandStock = findInventory.onHandStock;
            let qualifiedDemand = 0;

            const openOrder = await this.getCgOpenOrder(productId);

            // For lead time
            let leadTime =Number(findInventory.plantLeadTime );

            let roSigma = await this.calculateRoSigma(productId);
            let togRecommendation = (roSigma/4)*findInventory.plantLeadTime;
            let sumOfQualifiedDemand = await this.sumOfQualifiedDemand(productId);


            qualifiedDemand = Number(sumOfQualifiedDemand);
            // qualifiedDemand = Number(qualifiedDemandData)+Number(sumOfQualifiedDemand);

            // For Tog
            let tog = findInventory.tog
            // Fot netFlow 
            let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
            // For Moq
            let moq = Number(findInventory.moq)? Number(findInventory.moq):1;
            // For net orderRecommendation
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
                orderRecommendationStatus = 0
            } else {
                orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);

            }
            let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

            if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                onHandStatus = 0
            } else {
                onHandStatus = onHandStatusNumber
            }


            // For onHandStatus
            flag = await flagFunction(tog, onHandStock)
            let inventoryObject = {
                createdBy: createdBy,
                leadTime: leadTime,
                factorOfSafety: Number(0),
                tog: tog,
                togRecommendation:togRecommendation,
                openOrder: openOrder,
                netFlow: Math.abs(netFlow),
                moq: moq,
                orderRecommendation: orderRecommendation,
                orderRecommendationStatus: orderRecommendationStatus,
                onHandStatus: onHandStatus,
                onHandStock: onHandStock,
                qualifiedDemand: qualifiedDemand,
                flag: flag
            }
            await this.cgInventoryModel.findByIdAndUpdate({ _id: findInventory._id }, { ...inventoryObject }, { new: true, useFindAndModify: false })
          
            if (orderRecommendation >= 0) {

                await this.cgOrderModel.deleteMany({inventoryId: findInventory._id,"cg.stage": "PENDING"});

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

            } else if (orderRecommendation == 0) {
                await this.cgOrderModel.updateMany({
                    inventoryId: findInventory._id,
                    "cg.stage": "PENDING"
                }, { active: false });
            }
        }
        catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async getAvgWeeklyConsumptionLY4M(roId, productId) {
        try {
            let currentMonth = (new Date()).getMonth();
            let currentYear = (new Date()).getFullYear();
            const previousYear = currentYear - 1;
            let dateObj = await calculateDateRangeForLYM(currentMonth, currentYear);
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
                sameMonthAvgConsumption =1 ;
              }
            return sameMonthAvgConsumption;
        }
        catch (e) {
            console.log(e);
        }
    };
    
    async getAvgWeeklyConsumptionL12(roId, productId) {
        try {
            let dateObj = await calculateDateRangeForCym(new Date());
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
            } else {
                const dateResult = await this.roConsumptionModel.aggregate([
                    {$match:{roId: ObjectId(roId),productId: ObjectId(productId),}},
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
    
                    monthDifferences = await monthDifference(startDate, new Date(dateObj.endDate));
                    if (monthDifferences)
                       sameMonthAvgConsumption = (findSameMonthCon[0].totalQty) / Number(monthDifferences);
                    
                }
            }
            if (sameMonthAvgConsumption >= 0 && sameMonthAvgConsumption <= 4) {
                sameMonthAvgConsumption =1 ;
              }
            return sameMonthAvgConsumption;
        }
        catch (e) {
            console.log(e);
        }
        ;
    };
   
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
    public async getAvgWeeklyConsumptionByInventory(inventoryId): Promise<number> {
        try {
        const findInventory = await this.roInventoryModel.findOne({
            _id: inventoryId
        })

        let avgWeeklyConsumption = 0;
        const currentDate = new Date();
        const thirteenWeeksAgo = new Date();
        thirteenWeeksAgo.setDate(currentDate.getDate() - 13 * 7);
        let checkConsumptionExit = await this.roConsumptionModel.aggregate([{
            $match: { date: { $lte: thirteenWeeksAgo }, roId: findInventory.roId, productId: findInventory.productId }
        },
        ]);
        if (checkConsumptionExit.length > 0) {
            let totalConsumption = await this.roConsumptionModel.aggregate([
                {
                    $match: {
                        roId: findInventory.roId,
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
                avgWeeklyConsumption = (totalConsumption[0].totalQty) / 13

            }
        } else {
            let findConsumption = await this.roConsumptionModel.aggregate([
                {
                    $match:
                        { productId: findInventory.productId, roId: findInventory.roId }
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
                    
    } catch (e) {
        throw new InternalServerErrorException(e)
    }
    };

    public async generateUniqueNumber(): Promise<any> {
        try {
        let randomNumber = Math.floor(Math.random() * (1000 - 400)) + 400;
        return `${randomNumber}`;
                    
    } catch (e) {
        throw new InternalServerErrorException(e)
    }
    };

    async changeUniqueNumber() {
        try {
            let documentsToUpdate = await this.roOrderModel.find({ "cg.status": true, "cg.stage": "PENDING", uniqueNumber: 1 });
            for await (const document of documentsToUpdate) {

                const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;

                const updatedDocument = await this.roOrderModel.findByIdAndUpdate(document._id, { $set: { uniqueNumber: uniqueNumber } }, { new: true });
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    public async getOpenOrder(roId, productId): Promise<number> {
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
                                $and: [{ $or: [{ "cg.stage": "ACCEPT" },  { "wip.stage": "ACCEPT" },] }, { "in_trasit.stage": "PENDING" },]
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
            return openOrder
        } catch (error) {
            return 0;
        }

    };

    public async createInventory(createInventoryDto: CreateRoInventoryDto, req: Request) {
        try {
            let date = await dateFormate(new Date());
            const findInventory = await this.roInventoryModel.findOne({
                roId: ObjectId(createInventoryDto.roId),
                productId: ObjectId(createInventoryDto.productId)
            });

            const ro = await this.roMasterModel.findOne({_id: ObjectId(createInventoryDto.roId)});

            if (findInventory) {
                throw new BadRequestException("Inventory already exist")
            }
 
            if (ro == null) {
                throw new BadRequestException("Ro not found")
            }

            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "BLACK";
            let onHandStock = createInventoryDto.onHandStock;
            let qualifiedDemand = createInventoryDto.qualifiedDemand;
            let openOrder = 0;
            let netFlow = 0;
            let tog = createInventoryDto.tog;

            netFlow = Number(openOrder+onHandStock-qualifiedDemand);
            let moq = Number(createInventoryDto.moq)?Number(createInventoryDto.moq):1;
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
                orderRecommendationStatus = 0
            } else {
                orderRecommendationStatus = Number(orderRecommendation) * 100 / tog
            }
            let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

            if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                onHandStatus = 0
            } else {
                onHandStatus = onHandStatusNumber
            };

            // For onHandStatus
            flag = await flagFunction(tog, onHandStock);

            const authInfo = await getAuthUserInfo(req.headers);

        let inventoryObject = {
                roId: createInventoryDto.roId,
                productId: createInventoryDto.productId,
                createdBy: authInfo._id,
                leadTime: createInventoryDto.leadTime,
                growthFactor:createInventoryDto.growthFactor,
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
                stockUpWeeks: ro.stockUpWeeks,
                isUpdateInventory:true
            };

            const inventory = new this.roInventoryModel(inventoryObject);
            if (await inventory.save()) {
                if (orderRecommendation >= 0) {

                    const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                    let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
                    let order = new this.roOrderModel({
                        ...createInventoryDto,
                        createdBy: authInfo._id,
                        qty: Number(orderRecommendation),
                        inventoryId: inventory.id,
                        roId: createInventoryDto.roId,
                        productId: createInventoryDto.productId,
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
                const cgInventoryExist = await this.cgInventoryModel.findOne({productId:createInventoryDto.productId})
                if(!cgInventoryExist){
                   await this.createCgInventory(createInventoryDto.productId,orderRecommendation,authInfo._id);
                }else{
                   await this.updateCgInventory(createInventoryDto.productId,orderRecommendation,authInfo._id);
                }
                return new GetRoInventoryInfoDto(inventory)
             }
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async getAllInventory(paginationDto: FilterPaginationRoInventoryDto, req: Request): Promise<any> {
        try {
            const authInfo = await getAuthUserInfo(req.headers);
            const currentPage = paginationDto.currentPage || 1;
            const recordPerPage = paginationDto.recordPerPage || 10;
            const orderByFields = paginationDto.orderBy || ["createdAt"]; // Default ordering by createdAt
            let sortFields = {};


            let activeCondition = { active: true };
            if (paginationDto.active == false) {
                activeCondition = { active: false }
            };

            if (paginationDto.sortBy && paginationDto.sortBy.length > 0) {
                let dynamicSortFields = paginationDto.sortBy;
                dynamicSortFields.forEach(field => {
                  if (field.orderValue == 1) {
                    sortFields[field.orderKey] = 1;
        
                  } else {
                    sortFields[field.orderKey] = -1;
        
                  }
                });
              } else {
                sortFields["createdAt"] = -1;
        
              }

            const condition = paginationDto.roId ? { roId: ObjectId(paginationDto.roId) } : {};
            const status = paginationDto.status ? { flag: paginationDto.status } : {};

            const filter = await multiSelectorFunction(paginationDto)
            const inventory = await this.roInventoryModel.aggregate([
                {
                    $match: status
                },
                {
                    $match: activeCondition
                },
                {
                    $match: condition
                },
                {
                    $lookup: {
                        from: "roconsumptions",
                        let: { productId: "$productId", roId: "$roId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $and: [{ $eq: ["$productId", "$$productId"] }, { $eq: ["$roId", "$$roId"] }] }
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
                        from: "romasters",
                        localField: "roId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, contactPersonName: 1, city: 1, state: 1, roName: 1 } }
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
                            { $project: { 
                                _id: 1, moq: 1, brandid: 1, groupid: 1, unitid: 1,
                                 itemCode: 1, itemDescription: 1, productName: 1,
                                  categoryid: 1, subcategoryid: 1,KW:1,HP:1,LP:1,
                                  productStage: 1, modelNo: 1,suc_del:1,finalPrice:1
                                 } }
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
                      from: "silverunits",
                      localField: "productInfo.unitid",
                      foreignField: "_id",
                      pipeline: [
                        { $project: { _id: 1,unitCode:1 ,unit: 1 } }
                      ],
                      as: "unitInfo",
                    },
                },
                {
                    $lookup: {
                      from: "silvergroups",
                      localField: "productInfo.groupid",
                      foreignField: "_id",
                      pipeline: [
                        { $project: { _id: 1,groupCode:1 ,group: 1 } }
                      ],
                      as: "groupInfo",
                    },
                },
                {
                    $lookup: {
                      from: "silverbrands",
                      localField: "productInfo.brandid",
                      foreignField: "_id",
                      pipeline: [
                        { $project: { _id: 1,brandCode:1 ,brand: 1 } }
                      ],
                      as: "brandInfo",
                    },
                },
                {
                    $project: {
                        roId: { $ifNull: [{ $first: "$roInfo._id" }, ""] },
                        contactPersonName: { $ifNull: [{ $first: "$roInfo.contactPersonName" }, ""] },
                        roName: { $ifNull: [{ $first: "$roInfo.roName" }, ""] },
                        itemCode: { $ifNull: [{ $first:"$productInfo.itemCode" }, 0] },
                        // itemCode: { $ifNull: [{ $toInt:{ $first:"$productInfo.itemCode"} }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        group: { $ifNull: [{ $first: "$groupInfo.group" }, ""] },
                        groupid: { $ifNull: [{ $first: "$groupInfo._id" }, ""] },
                        groupCode: { $ifNull: [{ $first: "$groupInfo.groupCode" }, ""] },
                        brand: { $ifNull: [{ $first: "$brandInfo.brand" }, ""] },
                        brandid: { $ifNull: [{ $first: "$brandInfo.br_idandid" }, ""] },
                        brandCode: { $ifNull: [{ $first: "$brandInfo.brandCode" }, ""] },
                        unit: { $ifNull: [{ $first: "$unitInfo.unit" }, ""] },
                        unitid: { $ifNull: [{ $first: "$unitInfo._id" }, ""] },
                        unitCode: { $ifNull: [{ $first: "$unitInfo.unitCode" }, ""] },
                        LP: { $ifNull: [{ $first: "$productInfo.LP" }, 0] },
                        HP: { $ifNull: [{ $first: "$productInfo.HP" }, ""] },
                        KW: { $ifNull: [{ $first: "$productInfo.KW" }, ""] },
                        productStage: { $ifNull: [{ $first: "$productInfo.productStage" }, ""] },
                        modelNo: { $ifNull: [{ $first: "$productInfo.modelNo" }, ""] },
                        suc_del: { $ifNull: [{ $first: "$productInfo.suc_del" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        moq: { $ifNull: ["$moq", ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        city: { $ifNull: [{ $first: "$roInfo.city" }, ""] },
                        state: { $ifNull: [{ $first: "$roInfo.state" }, ""] },
                        tog: { $ifNull: [{ $floor: "$tog" }, 0] },
                        leadTime: { $ifNull: ["$leadTime", 0] },
                        stockUpWeeks: { $ifNull: ["$stockUpWeeks", 0] },
                        growthFactor: { $ifNull: ["$growthFactor", ""] },
                        onHandStock: { $ifNull: ["$onHandStock", 0] },
                        isConvertFinalToTog: { $ifNull: ["$isConvertFinalToTog", false] },
                        isGrowthFactor: { $ifNull: ["$isGrowthFactor", false] },
                        qualifiedDemand: { $ifNull: ["$qualifiedDemand", 0] },
                        orderRecommendation: { $ifNull: ["$orderRecommendation", 0] },
                        orderRecommendationStatus: {
                            $cond: {
                              if: {$or:[{$eq: ["$orderRecommendationStatus", "NaN"]},{$eq: ["$orderRecommendationStatus", "Infinity"]}]  },
                              then: "0",
                              else: "$orderRecommendationStatus"
                            }
                          },
                        onHandStatus: { $ifNull: ["$onHandStatus", ""] },
                        flag: { $ifNull: ["$flag", ""] },
                        consumption: { $ifNull: ["$consumption", 0] },
                        netFlow: { $ifNull: ["$netFlow", 0] },
                        openOrder: { $ifNull: ["$openOrder", 0] },
                        LYM: { $ifNull: ["$LYM", 0] },
                        CYM: { $ifNull: ["$CYM", 0] },
                        L13: { $ifNull: ["$L13", 0] },
                        LBS: { $ifNull: ["$LBS", 0] },
                        SWB: { $ifNull: ["$SWB", 0] },
                        togRecommendation: { $ifNull: ["$togRecommendation", 0] },
                        finalTog: { $ifNull: ["$finalTog", 0] },
                        oldTog: { $ifNull: ["$oldTog", 0] },
                        active: { $ifNull: ["$active", true] },
                        isUpdateTog: { $ifNull: ["$isUpdateTog", false] },
                        createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        avg: { $ifNull: [{ $floor: "$rWC" }, 0] },
                        togValue:{
                            $ifNull: [
                              {
                                $multiply: [
                                  { $ifNull: [{$toDouble:"$tog"}, 1] }, 
                                  { $ifNull: [{$toDouble:{ $first: "$productInfo.finalPrice" }}, 1] }
                                ]
                              },
                              1
                            ]
                          },
                        stockValue:{
                            $ifNull: [
                              {
                                $multiply: [
                                  { $ifNull: [{$toDouble:"$onHandStock"}, 1] }, 
                                  { $ifNull: [{$toDouble:{ $first: "$productInfo.finalPrice" }}, 1] }
                                ]
                              },
                              1
                            ]
                          },
                        rrValue:{
                            $ifNull: [
                              {
                                $multiply: [
                                  { $ifNull: [{$toDouble:"$orderRecommendation"}, 1] }, 
                                  { $ifNull: [{$toDouble:{ $first: "$productInfo.finalPrice" }}, 1] }
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
                            { leadTime: { $eq: parseInt(paginationDto.search) } },
                            { stockUpWeeks: { $eq: parseInt(paginationDto.search) } },
                            { LYM: { $eq: parseInt(paginationDto.search) } },
                            { CYM: { $eq: parseInt(paginationDto.search) } },
                            { L13: { $eq: parseInt(paginationDto.search) } },
                            { LBS: { $eq: parseInt(paginationDto.search) } },
                            { SWB: { $eq: parseInt(paginationDto.search) } },
                            { togRecommendation: { $eq: parseInt(paginationDto.search) } },
                            { finalTog: { $eq: parseInt(paginationDto.search) } },
                            { oldTog: { $eq: parseInt(paginationDto.search) } },
                            { factorOfSafety: { $eq: parseInt(paginationDto.search) } },
                            { onHandStock: { $eq: parseInt(paginationDto.search) } },
                            { qualifiedDemand: { $eq: parseInt(paginationDto.search) } },
                            { orderRecommendation: { $eq: parseInt(paginationDto.search) } },
                            { netFlow: { $eq: parseInt(paginationDto.search) } },
                            { openOrder: { $eq: parseInt(paginationDto.search) } },
                            { consumption: { $eq: parseInt(paginationDto.search) } },
                            { avg: { $eq: parseInt(paginationDto.search) } },
                            { createdAt: { $regex: paginationDto.search, $options: "i" }, },
                        ]
                    }
                },
                {
                    $match: filter
                },
                { $sort: { [orderByFields[0]]: 1 } },
                // { $sort: sortFields },
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
                throw new BadRequestException('Data Not Found');
            }
            return inventory;
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async getInventoryInfo(id: string): Promise<any> {
        try {
            const inventory = await this.roInventoryModel.aggregate([
                {
                    $match: { active: true, _id: ObjectId(id) }
                },
                {
                    $lookup: {
                        from: "romasters",
                        localField: "roId",
                        foreignField: "_id",
                        pipeline: [
                            { $project: { _id: 1, contactPersonName: 1, city: 1, state: 1, roName: 1 } }
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
                        roId: { $ifNull: [{ $first: "$roInfo._id" }, ""] },
                        contactPersonName: { $ifNull: [{ $first: "$roInfo.contactPersonName" }, ""] },
                        roName: { $ifNull: [{ $first: "$roInfo.roName" }, ""] },
                        itemCode: { $ifNull: [{ $first:"$productInfo.itemCode" }, 0] },
                        // itemCode: { $ifNull: [{$toInt:{ $first:"$productInfo.itemCode"} }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        moq: { $ifNull: [{ $first: "$productInfo.moq" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        city: { $ifNull: [{ $first: "$roInfo.city" }, ""] },
                        state: { $ifNull: [{ $first: "$roInfo.state" }, ""] },
                        tog: { $ifNull: [{ $floor: "$tog" }, 0] },
                        leadTime: { $ifNull: ["$leadTime", 0] },
                        stockUpWeeks: { $ifNull: ["$stockUpWeeks", 0] },
                        growthFactor: { $ifNull: ["$growthFactor", 0] },
                        oldTog: { $ifNull: ["$oldTog", 0] },
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
                        isUpdateTog: { $ifNull: ["$isUpdateTog", false] },
                    }
                },
            ]).exec();

            if (!inventory || !inventory[0]) {
                throw new BadRequestException('Data Not Found');
            }
            let data = await this.roInventoryModel.find({active:true});
    
            for (let findInventory of data) {
                console.log(findInventory.tog,5555,findInventory._id)
                await this.UpdateRoInventory(findInventory.tog,findInventory.productId,findInventory.roId)
            }


            return inventory[0];
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async updateInventoryStatus(id: string, updateStatusInventoryDto: UpdateStatusRoInventoryDto): Promise<UpdateStatusRoInventoryDto> {
        try {
            let findInventory = await this.roInventoryModel.findOne({
                _id: ObjectId(id)
            })
            if (!findInventory) {
                throw new BadRequestException("inventory not exit")
            }
            if (updateStatusInventoryDto.active === false) {
                await this.roOrderModel.updateMany({ inventoryId: ObjectId(id) }, { active: updateStatusInventoryDto.active }, { new: true, useFindAndModify: false })
                await this.roConsumptionModel.updateMany({ _id: ObjectId(id) }, { active: updateStatusInventoryDto.active }, { new: true, useFindAndModify: false })

            } else {
                const findProduct = await this.silverProductModel.findOne({ _id: findInventory.productId, active: false });
                const findChannelPartner = await this.roMasterModel.findOne({ _id: findInventory.roId, isActive: false });


                if (findProduct && findProduct != null) {
                    throw new BadRequestException("product is inactive");
                }
                if (findChannelPartner && findChannelPartner != null) {
                    throw new BadRequestException("channel partner is inactive");
                }
        }
            return await this.roInventoryModel.findByIdAndUpdate(findInventory._id, { active: updateStatusInventoryDto.active }, { new: true, useFindAndModify: false })
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async changeTog(id: string, changeTogDto: ChangeTogDto): Promise<any> {
        try {
            let findInventory = await this.roInventoryModel.findOne({ _id: ObjectId(id)})
            if (!findInventory) {
                throw new BadRequestException("inventory not exit")
            }
            let tog = 0;
            let updateInventory = {}
            
            if(changeTogDto.isConvertFinalToTog){
                tog = findInventory.togRecommendation;
     
                updateInventory ={
                    growthFactor:1,
                    isGrowthFactor:false,
                    oldTog:findInventory.tog,
                    isConvertFinalToTog: false,
                    tog:findInventory.togRecommendation,
                }
            }else if(changeTogDto.isGrowthFactor){
                    changeTogDto.tog  =`${Math.round(Number(changeTogDto.tog))}`  ;
                    changeTogDto.growthFactor  =changeTogDto.growthFactor ;
                    tog = Number(changeTogDto.tog);

                    updateInventory ={
                        tog:changeTogDto.tog,
                        isGrowthFactor: false,
                        oldTog:findInventory.tog,
                        isConvertFinalToTog:false, 
                        growthFactor:changeTogDto.growthFactor,
                    }
    
                
            }else if(changeTogDto.isNoTogChange){
                tog = Number(findInventory.tog);

                updateInventory ={
                    tog:findInventory.tog,
                    isGrowthFactor: false,
                    oldTog:findInventory.tog,
                    isConvertFinalToTog:false, 
                    growthFactor:changeTogDto.growthFactor,
                }
            }
            await this.UpdateRoInventory(tog,findInventory.productId,findInventory.roId);

            const cgInventory = await this.cgInventoryModel.findOne({productId:ObjectId(findInventory.productId).toString()});

            if(cgInventory){
                let roSigma = await this.calculateRoSigma(findInventory.productId);
                let togRecommendation = (roSigma/4)*Number(cgInventory.plantLeadTime);
                
                let isConvertFinalToTog = false;
                if(togRecommendation != cgInventory.togRecommendation || cgInventory.togRecommendation != cgInventory.oldTogRecommendation){
                    isConvertFinalToTog = true;
                }
                togRecommendation=Number(togRecommendation);

                await this.cgInventoryModel.findOneAndUpdate({productId:ObjectId(findInventory.productId).toString()},{roInventoryId:findInventory._id,togRecommendation:togRecommendation,growthFactor:changeTogDto.growthFactor,isGrowthFactor:true,isConvertFinalToTog:isConvertFinalToTog},{ new: true, useFindAndModify: false });
            }

            return await this.roInventoryModel.findByIdAndUpdate(findInventory._id,{...updateInventory}, { new: true, useFindAndModify: false } );

           
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async UpdateInventory(id: string, updateInventoryDto: UpdateRoInventoryDto, req: Request) {
        try {
            let date = await dateFormate(new Date());
            const authInfo = await getAuthUserInfo(req.headers)

            let findInventory = await this.roInventoryModel.findOne({_id:ObjectId(id)});

            let ro = await this.roMasterModel.findOne({_id: ObjectId(findInventory.roId)})
            if(ro == null){
                throw new BadRequestException("Ro not found")
            }

            if (!findInventory) {
                throw new BadRequestException("Inventory not found")
            }

            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "BLACK"
            let onHandStock = updateInventoryDto.onHandStock;
            let qualifiedDemand = updateInventoryDto.qualifiedDemand;
            let openOrder = await this.getOpenOrder(updateInventoryDto.roId, updateInventoryDto.productId);
            // For lead time

            let leadTime =Number(updateInventoryDto.leadTime )? Number(updateInventoryDto.leadTime):Number(ro.leadTime)


            // For LBS
            let findMaximum = Math.max(findInventory.LYM,findInventory.CYM,findInventory.L13);
            let LBS = (findMaximum/4)*ro.leadTime;
            let SWB = (findMaximum/4)*ro.stockUpWeeks;
            let togRecommendation = LBS+SWB


            // For Tog
            let tog = !isNaN(Number(updateInventoryDto.tog)) && updateInventoryDto.tog !== null ? Number(updateInventoryDto.tog) : findInventory.tog;


            if (ro == null) {
                throw new BadRequestException("Ro not found")
            }
            // Fot netFlow 
            let netFlow = Number(onHandStock + openOrder-qualifiedDemand);
            // For Moq
            let moq = Number(updateInventoryDto.moq) ? Number(updateInventoryDto.moq):1;
            // For net orderRecommendation
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
                orderRecommendationStatus = 0
            } else {
                orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);
            }
            let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

            if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                onHandStatus = 0
            } else {
                onHandStatus = onHandStatusNumber
            }

            // For onHandStatus
            flag = await flagFunction(tog, onHandStock);
            let inventoryObject = {
                createdBy: authInfo._id,
                leadTime: leadTime,
                growthFactor: updateInventoryDto.growthFactor?updateInventoryDto.growthFactor:findInventory.growthFactor,
                stockUpWeeks: updateInventoryDto.stockUpWeeks?updateInventoryDto.stockUpWeeks:findInventory.stockUpWeeks,
                finalTog: tog,
                openOrder: openOrder,
                netFlow: Math.abs(netFlow),
                moq: moq,
                orderRecommendation: orderRecommendation,
                orderRecommendationStatus: orderRecommendationStatus,
                onHandStatus: onHandStatus,
                onHandStock: onHandStock,
                qualifiedDemand: qualifiedDemand,
                flag: flag,
                togRecommendation:togRecommendation,
                LBS:LBS,
                SWB:SWB,
                tog:tog
            }
            await this.roInventoryModel.findByIdAndUpdate({ _id: findInventory._id }, { ...inventoryObject }, { new: true, useFindAndModify: false })
            if (orderRecommendation >= 0) {
                await this.roOrderModel.deleteMany({inventoryId: findInventory._id,"cg.stage": "PENDING"});

                const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;

                let order = new this.roOrderModel({
                    ...updateInventoryDto,
                    createdBy: authInfo._id,
                    qty: Number(orderRecommendation),
                    inventoryId: findInventory._id,
                    roId: findInventory.roId,
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

            }else if (orderRecommendation == 0) {
                await this.roOrderModel.updateMany({
                    inventoryId: findInventory._id,
                    "cg.stage": "PENDING"
                }, { active: false });
            }

            const cgInventoryExist = await this.cgInventoryModel.findOne({productId:updateInventoryDto.productId})
            if(!cgInventoryExist){
               await this.createCgInventory(updateInventoryDto.productId,orderRecommendation,authInfo._id);
            }else{
               await this.updateCgInventory(updateInventoryDto.productId,orderRecommendation,authInfo._id);
            }
        }
        catch (e) {
            throw new InternalServerErrorException(e);
        }
    };

    async getDashBoardInventoryInfo(getDashBoardInventoryInfo: GetDashBoardRoInventoryInfo, req: Request): Promise<any> {
        try {
            const authInfo = await getAuthUserInfo(req.headers);
            const user = await this.userModel.findOne({ _id: ObjectId(authInfo._id), userType: "ROTEX" })
            let productObj = {}
            if (user) {

                const units = user?.units ?? [];
                const productIds = await this.silverProductModel.find(
                    { unitid: { $in: units } })
                let arr = productIds ? productIds.map((item) => item._id) : [];
                productObj = { productId: { $in: arr } }
            }
            let condition = {};
            let activeCondition = { active: true }

            if (getDashBoardInventoryInfo.roId) {
                condition = { roId: ObjectId(getDashBoardInventoryInfo.roId) }
            }


            if (getDashBoardInventoryInfo.active == false) {
                activeCondition = { active: false }
            }

            const inventoyallCount = await this.roInventoryModel.countDocuments({
                $and: [condition, activeCondition]
            });

            const inventory = await this.roInventoryModel.aggregate([
                {
                    $match: productObj
                },
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

            ])
            inventory.push({ "count": inventoyallCount, "flag": "all" });
            return inventory;
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async getInventoryDropDown(req: Request,addRoIdInfo:AddRoIdInfo): Promise<any> {
        try {
            const authInfo = await getAuthUserInfo(req.headers);
            let roObj = {}
            if(addRoIdInfo.roId){
                roObj={roId:ObjectId(addRoIdInfo.roId)}
            }
            const inventory = await this.roInventoryModel.aggregate([
                { $match: { active: true, }},
                {$match:roObj},
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
                                    city: 1,
                                    state: 1,
                                    roName: 1,
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
                        roId: { $ifNull: [{ $first: "$roInfo._id" }, ""] },
                        contactPersonName: { $ifNull: [{ $first: "$roInfo.contactPersonName" }, ""] },
                        roName: { $ifNull: [{ $first: "$roInfo.roName" }, ""] },
                        itemCode: { $ifNull: [{$first:"$productInfo.itemCode" }, 0] },
                        // itemCode: { $ifNull: [{$toInt:{ $first:"$productInfo.itemCode"} }, 0] },
                        itemDescription: { $ifNull: [{ $first: "$productInfo.itemDescription" }, ""] },
                        productName: { $ifNull: [{ $first: "$productInfo.productName" }, ""] },
                        categoryid: { $ifNull: [{ $first: "$productInfo.categoryid" }, ""] },
                        subcategoryid: { $ifNull: [{ $first: "$productInfo.subcategoryid" }, ""] },
                        subCategoryName: { $ifNull: [{ $first: "$subcategoryInfo.subcategoryName" }, ""] },
                        productId: { $ifNull: [{ $first: "$productInfo._id" }, ""] },
                        moq: { $ifNull: [{ $first: "$productInfo.moq" }, ""] },
                        categoryName: { $ifNull: [{ $first: "$categoryInfo.categoryName" }, ""] },
                        city: { $ifNull: [{ $first: "$roInfo.city" }, ""] },
                        state: { $ifNull: [{ $first: "$roInfo.state" }, ""] },
                        tog: { $ifNull: [{ $floor: "$tog" }, 0] },
                        LYM: { $ifNull: ["$LYM", 0] },
                        CYM: { $ifNull: ["$CYM", 0] },
                        L13: { $ifNull: ["$L13", 0] },
                        LBS: { $ifNull: ["$LBS", 0] },
                        SWB: { $ifNull: ["$SWB", 0] },
                        growthFactor: { $ifNull: ["$growthFactor", ""] },
                        togRecommendation: { $ifNull: ["$togRecommendation", 0] },
                        finalTog: { $ifNull: ["$finalTog", 0] },
                        oldTog: { $ifNull: ["$oldTog", 0] },
                        leadTime: { $ifNull: ["$leadTime", 0] },
                        stockUpWeeks: { $ifNull: ["$stockUpWeeks", 0] },
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
                    },
                },
            ]).exec();
            if (!inventory) {
                throw new BadRequestException('Data Not Found');
            }
            return inventory;
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async importInventory(createInventoryDto: ImportRoInventoryDto[], req: Request): Promise<any> {
        try {
            let date = await dateFormate(new Date());
            const authInfo = await getAuthUserInfo(req.headers);
            let errorArrray = []
            const dataArray = Array.isArray(createInventoryDto) ? createInventoryDto : Object.values(createInventoryDto);
            const mappedArray = await Promise.all(dataArray.map(async (inventory: any) => {
               
                const existProduct = await this.silverProductModel.findOne({productName: inventory.productName});

                const exitRo = await this.roMasterModel.findOne({ $or:[{ roName: inventory.roName }, { email: inventory.email }] })
                let existInventory = null;
                if (existProduct && exitRo) {
                    existInventory = await this.roInventoryModel.findOne({ productId: existProduct._id, roId: exitRo._id });
                } else {
                    existInventory = null
                }

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

                const checkNumber = (property, errorMessage) => {
                    if (typeof property !== 'number') {
                        errString += `${errorMessage} ,`;
                    }
                };

                checkBlank(inventory.productName, "productName is blank");
                checkBlank(inventory.roName, "roName is blank");

                
            
                if (!errString) {

                    if (exitRo && existProduct  && !existInventory) {
                        let orderRecommendation = 0;
                        let onHandStatus = 0;
                        let flag = "BLACK"
                        let onHandStock = inventory.onHandStock ? inventory.onHandStock :0 ;
                        let qualifiedDemand = inventory.qualifiedDemand?inventory.qualifiedDemand:0;

                        // Check consumption exist 
                        const findConsumption = await this.roConsumptionModel.findOne({
                            roId: ObjectId(exitRo._id),
                            productId: ObjectId(existProduct._id)
                        });
                        if (findConsumption) {
                            onHandStock = Math.abs(findConsumption.qty - (inventory.onHandStock))
                            qualifiedDemand = Math.abs(findConsumption.qty - (inventory.qualifiedDemand))
                        }

                        const openOrder = await this.getOpenOrder(exitRo._id, existProduct._id);


                        // For lead time

                        let findLeadTime = 0;
                        // let findLeadTime = await this.roMasterModel.findOne({ _id: exitRo._id })
                        let leadTime = inventory.leadTime ? Number(inventory.leadTime):Number(findLeadTime);

                        // For Tog
                        let tog = Number(inventory.tog) ? Number(inventory.tog) : 0;

                        // For netFlow 
                        let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
                        // For Moq
                        let moq = Number(inventory.moq)?Number(inventory.moq):1;
                        // For net orderRecommendation
                        let tog_net = await Math.abs(Number(tog - netFlow));
                        if (netFlow >= tog) {
                            // orderRecommendation = netFlow;
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
                            orderRecommendationStatus = 0
                        } else {
                            orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog)

                        }
                        let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

                        if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                            onHandStatus = 0
                        } else {
                            onHandStatus = onHandStatusNumber
                        }


                        // For onHandStatus
                        flag = await flagFunction(tog, onHandStock)

                        
                        let active = inventory.active;
                        let inventoryObject = {
                            roId: exitRo._id,
                            productId: existProduct._id,
                            createdBy: authInfo._id,
                            leadTime: leadTime,
                            factorOfSafety: Number(exitRo.growthFactor),
                            tog: tog,
                            openOrder: openOrder,
                            active:active,
                            netFlow: Math.abs(netFlow),
                            moq: moq,
                            orderRecommendation: orderRecommendation,
                            orderRecommendationStatus: orderRecommendationStatus,
                            onHandStatus: onHandStatus,
                            flag: flag,
                            onHandStock: onHandStock,
                            qualifiedDemand: qualifiedDemand,
                            isUpdateInventory:true

                        }


                        let inventorys = new this.roInventoryModel(inventoryObject);
                        if (await inventorys.save()) {
                            if (orderRecommendation >=0) {
                        
                    
                                let order = new this.roOrderModel({
                                    ...createInventoryDto,
                                    createdBy: authInfo._id,
                                    roId: exitRo._id,
                                    productId: existProduct._id,
                                    qty: Number(orderRecommendation),
                                    inventoryId: inventorys._id,
                                    status: flag,
                                    createdAt: date,
                                    "recommendation.qty": Number(orderRecommendation),
                                    "cg.qty": Number(orderRecommendation),
                                    "recommendation.createdAt": date,
                                    "cg.createdAt": date,
                                });
                                order.save();
                            }
                            // const cgInventoryExist = await this.cgInventoryModel.findOne({productId:existProduct._id})
                            // if(!cgInventoryExist){
                            //    await this.createCgInventory(existProduct._id,orderRecommendation,authInfo._id);
                            // }else{
                            //    await this.updateCgInventory(existProduct._id,orderRecommendation,authInfo._id);
                            // }
                            return new GetRoInventoryInfoDto(inventorys)
                        }
                    } else if (exitRo && existProduct && existInventory !== null) {
                        let orderRecommendation = 0;
                        let onHandStatus = 0;
                        let flag = "BLACK"
                        const onHandStock = Number(inventory.onHandStock) ? Number(inventory.onHandStock):existInventory.onHandStock;
                        const qualifiedDemand = Number(inventory.qualifiedDemand) ? Number(inventory.qualifiedDemand):existInventory.qualifiedDemand;
                        const leadTime = inventory.leadTime ? Number(inventory.leadTime):Number(existInventory.leadTime);
                        const openOrder = await this.getOpenOrder(exitRo._id, existProduct._id);
                        let tog = Number(inventory.tog) ? Number(inventory.tog) : existInventory.tog;

                        // For netFlow 
                        const netFlow = Number(onHandStock + openOrder - qualifiedDemand);
                        // For Moq
                        const moq = Number(inventory.moq)?Number(inventory.moq):1;
                        // For net orderRecommendation
                        const tog_net = await Math.abs(Number(tog - netFlow));
                        if (netFlow >= tog) {
                            // orderRecommendation = netFlow;
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
                            orderRecommendationStatus = 0
                        } else {
                            orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);

                        }
                        let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

                        if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                            onHandStatus = 0
                        } else {
                            onHandStatus = onHandStatusNumber
                        }


                        // For onHandStatus
                        flag = await flagFunction(tog, onHandStock)
                        let active = inventory.active
                        const authInfo = await getAuthUserInfo(req.headers)
                        let inventoryObject = {
                            roId: exitRo._id,
                            productId: existProduct._id,
                            createdBy: authInfo._id,
                            leadTime: leadTime,
                            growthFactor: Number(exitRo.growthFactor),
                            tog: tog,
                            openOrder: openOrder,
                            netFlow: Math.abs(netFlow),
                            moq: moq,
                            active:active,
                            orderRecommendation: orderRecommendation,
                            orderRecommendationStatus: orderRecommendationStatus,
                            onHandStatus: onHandStatus,
                            flag: flag,
                            onHandStock: onHandStock,
                            qualifiedDemand: qualifiedDemand

                        }


                        await this.roInventoryModel.findByIdAndUpdate(
                            { _id: existInventory._id },
                            {
                                ...inventoryObject
                            },
                            { new: true, setDefaultsOnInsert: false }
                        ).lean();

                        // const cgInventoryExist = await this.cgInventoryModel.findOne({productId:existProduct._id})
                        // if(!cgInventoryExist){
                        //    await this.createCgInventory(existProduct._id,orderRecommendation,authInfo._id);
                        // }else{
                        //    await this.updateCgInventory(existProduct._id,orderRecommendation,authInfo._id);
                        // }

                        if (orderRecommendation > 0) {
                            await this.roOrderModel.deleteMany({inventoryId: existInventory._id,"cg.stage": "PENDING"});
                            let order = new this.roOrderModel({
                                ...createInventoryDto,
                                createdBy: authInfo._id,
                                qty: Number(orderRecommendation),
                                inventoryId: existInventory._id,
                                roId: exitRo._id,
                                productId: existProduct._id,
                                status: flag,
                                createdAt: date,
                                "recommendation.qty": Number(orderRecommendation),
                                "cg.qty": Number(orderRecommendation),
                                "recommendation.createdAt": date,
                                "cg.createdAt": date,
                            });
                            order.save();
                        }

                    } else {
                        // await checkNumber(inventory.tog, "tog should be number");
                        // await checkNumber(inventory.onHandStock, "onHandStock should be number");
                        // await checkNumber(inventory.qualifiedDemand, "qualifiedDemand should be number");
                        await checkExist(existProduct, "product does not exist");
                        await checkExist(exitRo, "cg does not exist");
                    }
                }

                if (errString !== "") {
                    inventory["error"] = errString;
                    errorArrray.push(inventory);
                }
            })
            );

              await this.changeUniqueNumber();
              setTimeout(async function() {
                await this.changeUniqueNumber();
                await this.updateCgData(authInfo)
                console.log("Inside setTimeout function");
              }.bind(this), 10000);
              
            return new GetRoInventoryInfoDto({ mappedArray: mappedArray, errorArrray: errorArrray });
        }
        catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async importInventoryAndUpdateStock(createInventoryDto: ImportRoInventoryAndUpdateStockDto[], req: Request): Promise<any> {
        try {
            const authInfo = await getAuthUserInfo(req.headers)
            let date = await dateFormate(new Date());
            let errorArrray = []
            const dataArray = Array.isArray(createInventoryDto) ? createInventoryDto : Object.values(createInventoryDto);
            const mappedArray = await Promise.all(dataArray.map(async (inventory: any) => {
               
                const existProduct = await this.silverProductModel.findOne({productName: inventory.productName});

                const exitRo = await this.roMasterModel.findOne({ $or:[{ roName: inventory.roName }, { email: inventory.email }] })
                let existInventory = null;
                if (existProduct && exitRo) {
                    existInventory = await this.roInventoryModel.findOne({ productId: existProduct._id, roId: exitRo._id });
                } else {
                    existInventory = null
                }

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

                const checkNumber = (property, errorMessage) => {
                    if (typeof property !== 'number') {
                        errString += `${errorMessage} ,`;
                    }
                };


                checkBlank(inventory.productName, "productName is blank");
                checkBlank(inventory.roName, "roName is blank");
                checkBlank(inventory.tog, "tog is blank");
                checkBlank(inventory.onHandStock, "onHandStock is blank");
                checkBlank(inventory.qualifiedDemand, "qualifiedDemand is blank");

                if (!errString) {

                   if (exitRo && existProduct && existInventory !== null) {

                    if (inventory.consumption != "NO" && inventory.onHandStock < existInventory.onHandStock) {
                        // if(inventory.onHandStock > existInventory.onHandStock){
                        //     errString += "" 
                        // }
                        const qty = existInventory.onHandStock - Number(inventory.onHandStock);
                        const consumption = new this.roConsumptionModel({
                            roId: ObjectId(exitRo._id),
                            productId: ObjectId(existProduct._id),
                            qty: qty,
                            createdAt: date,
                            inventoryId: existInventory._id, createdBy: existInventory.createdBy
                        });
                        consumption.save();
                    }
                        let orderRecommendation = 0;
                        let onHandStatus = 0;
                        let flag = "BLACK"
                        let onHandStock = Number(inventory.onHandStock)
                        let qualifiedDemand = existInventory.qualifiedDemand
                        let leadTime = Number(existInventory.leadTime);
                        const openOrder = await this.getOpenOrder(exitRo._id, existProduct._id);
                        let tog = existInventory.tog;

                        // For netFlow 
                        let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
                        // For Moq
                        let moq = Number(inventory.moq)?Number(inventory.moq):1;
                        // For net orderRecommendation
                        let tog_net = await Math.abs(Number(tog - netFlow));
                        if (netFlow >= tog) {
                            // orderRecommendation = netFlow;
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
                            orderRecommendationStatus = 0
                        } else {
                            orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);

                        }
                        let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

                        if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
                            onHandStatus = 0
                        } else {
                            onHandStatus = onHandStatusNumber
                        }


                        // For onHandStatus
                        flag = await flagFunction(tog, onHandStock)

                   
                        let inventoryObject = {
                            roId: exitRo._id,
                            productId: existProduct._id,
                            createdBy: authInfo._id,
                            leadTime: leadTime,
                            growthFactor: Number(exitRo.growthFactor),
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
                        }

                        await this.roInventoryModel.findByIdAndUpdate(
                            { _id: existInventory._id },
                            {
                                ...inventoryObject
                            },
                            { new: true, setDefaultsOnInsert: false }
                        ).lean();
                        if (orderRecommendation >= 0) {

                            await this.roOrderModel.deleteMany({inventoryId: existInventory._id,"cg.stage": "PENDING"});

                            const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
                            let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;

                            let order = new this.roOrderModel({
                                ...createInventoryDto,
                                createdBy: authInfo._id,
                                qty: Number(orderRecommendation),
                                inventoryId: existInventory._id,
                                roId: exitRo._id,
                                productId: existProduct._id,
                                status: flag,
                                createdAt: date,
                                // uniqueNumber:uniqueNumber,
                                "recommendation.qty": Number(orderRecommendation),
                                "cg.qty": Number(orderRecommendation),
                                "recommendation.createdAt": date,
                                "cg.createdAt": date,
                            });
                            order.save();
                        }

                        // const cgInventoryExist = await this.cgInventoryModel.findOne({productId:existProduct._id})
                        // if(!cgInventoryExist){
                        //    await this.createCgInventory(existProduct._id,orderRecommendation,authInfo._id);
                        // }else{
                        //    await this.updateCgInventory(existProduct._id,orderRecommendation,authInfo._id);
                        // }

                       

                    } else {
                
                        await checkNumber(inventory.onHandStock, "onHandStock should be number");
                        await checkExist(existProduct, "product does not exist");
                        await checkExist(exitRo, "cg does not exist");
                    }
                }

                if (errString !== "") {
                    inventory["error"] = errString;
                    errorArrray.push(inventory);
                }
            })
            );

              await this.changeUniqueNumber();
              setTimeout(async function() {
                await this.changeUniqueNumber();
                await this.updateCgData(authInfo)
                console.log("Inside setTimeout function");
              }.bind(this), 10000);
              
            return new GetRoInventoryInfoDto({ mappedArray: mappedArray, errorArrray: errorArrray });
        }
        catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async getInventoryMoreInfo(viewotherInventoryDto: ViewotherRoInventoryDto): Promise<any> {
        try {
            const inventory = await this.roInventoryModel.aggregate([
                {
                    $match: {
                        active: true, roId: ObjectId(viewotherInventoryDto.roId),
                        productId: ObjectId(viewotherInventoryDto.productId)
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
                throw new BadRequestException('Data Not Found');
            }

            return inventory[0];
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async getProductDropDown(searchDto: SearchDto,req: Request): Promise<any> {
        try {
          const authInfo = await getAuthUserInfo(req.headers);
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
                // itemCode: { $ifNull: [{$toInt:"$itemCode"}, 0] },
                itemDescription: { $ifNull: ["$itemDescription", ""] },
                productName: { $ifNull: ["$productName", ""] },
                categoryid: { $ifNull: ["$categoryid", ""] },
                categoryName: { $ifNull: ["$categoryInfo.categoryName", ""] },
                subcategoryid: { $ifNull: ["$subcategoryid", ""] },
                subcategoryName: { $ifNull: ["$subcategoryInfo.subcategoryName", ""] },
                active: { $ifNull: ["$active", false] },
                moq: { $ifNull: ["$moq", ""] },
                LYM: { $ifNull: ["$LYM", 0] },
                CYM: { $ifNull: ["$CYM", 0] },
                L13: { $ifNull: ["$L13", 0] },
                LBS: { $ifNull: ["$LBS", 0] },
                SWB: { $ifNull: ["$SWB", 0] },
                growthFactor: { $ifNull: ["$growthFactor", ""] },
                togRecommendation: { $ifNull: ["$togRecommendation", 0] },
                finalTog: { $ifNull: ["$finalTog", 0] },
                leadTime: { $ifNull: ["$leadTime", 0] },
                stockUpWeeks: { $ifNull: ["$stockUpWeeks", 0] },
                createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } },
              },
            },
          ]).exec()
          if (!data) {
            throw new BadRequestException('Data Not Found');
          }
          return data;
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    };

    async UpdateTogToggle(id: string, updateTogToggleDto: UpdateTogToggleDto, req: Request) {
        try {
            let date = await dateFormate(new Date());
            const authInfo = await getAuthUserInfo(req.headers)

            let findInventory = await this.roInventoryModel.findOne({_id: ObjectId(id)});

            if (!findInventory) {
                throw new BadRequestException("Inventory not found")
            }
            await this.roInventoryModel.findByIdAndUpdate({ _id: findInventory._id }, {isUpdateTog:updateTogToggleDto.isUpdateTog }, { new: true, useFindAndModify: false })
            
        }
        catch (e) {
            throw new InternalServerErrorException(e)
        }
    };


    async UpdateTogRecommendation() {
        try {
    const allInventory = await this.roInventoryModel.find({ isUpdateInventory: false });
    if(allInventory.length >0){
        for (let inventoryEle of allInventory){
        // allInventory.forEach(async(inventoryEle)=>{

                let LYM = inventoryEle.LYM;
                let CYM = inventoryEle.CYM;
                let L13 = inventoryEle.L13;
                let LBS = inventoryEle.LBS;
                let SWB = inventoryEle.SWB;
                let togRecommendation = inventoryEle.togRecommendation;
                let LBSMax = 0;
          
                const findConsumption = await this.roConsumptionModel.findOne({
                  roId: ObjectId(inventoryEle.roId),
                  productId: ObjectId(inventoryEle.productId)
                });
                if (findConsumption) {
                  LYM = Number(await this.getAvgWeeklyConsumptionLY4M(inventoryEle.roId, inventoryEle.productId));
                  CYM = Number(await this.getAvgWeeklyConsumptionL12(inventoryEle.roId, inventoryEle.productId));
                  L13 = Number(await this.getAvgWeeklyConsumptionL3(inventoryEle.roId, inventoryEle.productId));
                }
          
                LBSMax = (Number(Math.max(LYM, CYM, L13))) / 4;
          
                LBS = Number(LBSMax) * Number(inventoryEle.leadTime);
          
                SWB = Number(LBSMax) * Number(inventoryEle.stockUpWeeks);
          
                togRecommendation = SWB + LBS;
                if (togRecommendation >= 1 && togRecommendation <= 4) {
                  togRecommendation = 5;
              }
               togRecommendation= (Math.round(togRecommendation/10)*10);
                let inventoryObject = {
                  togRecommendation:togRecommendation,
                  LYM: Math.round(LYM),
                  CYM: Math.round(CYM),
                  L13: Math.round(L13),
                  LBS: Math.round(LBS),
                  SWB: Math.round(SWB),
                  "growthFactor": "1",
                  isGrowthFactor: true,
                  isConvertFinalToTog: true
                }
                await this.roInventoryModel.findByIdAndUpdate({ _id: inventoryEle._id, isUpdateInventory: false },{ ...inventoryObject, isUpdateInventory: true }, { new: true, useFindAndModify: false })
        // })
            }
    }
        }
        catch (e) {
            throw new InternalServerErrorException(e)
        }
    };
}; 

