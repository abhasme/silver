var fs = require('fs');
const xlsx = require('xlsx');
import * as gcm from 'node-gcm';
import { Injectable } from '@nestjs/common';
const ObjectId = require('mongoose').Types.ObjectId;
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { google } from 'googleapis'

//Silver

import { RoInventory, RoInventoryDocument } from '../../entities/Silver/roInventory';
import { SilverProduct, SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { RoMaster, RoMasterDocument } from '../../entities/Silver/roMaster';
import { CgInventory, CgInventoryDocument } from '../../entities/Silver/cgInventory';
import { RoOrder, RoOrderDocument } from '../../entities/Silver/roOrder';
import { CgOrder, CgOrderDocument } from '../../entities/Silver/cgOrder';
import { RoConsumption, RoConsumptionDocument } from '../../entities/Silver/roConsumption';
import { CgConsumption, CgConsumptionDocument } from '../../entities/Silver/cgConsumption';
import { monthDifference, calculateDateRangeForCym,calculateDateRangeForLYM, flagFunction, dateFormate } from './jwt.helper';
export class UploadFilesHelper {

  static customFileName(req, file, cb) {
    // const uniqueSuffix =new Date() + '_' + Math.round(Math.random() * 1e9);
    const uniqueSuffix = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata'
    }).replace(/[^\d]/g, '') + '_' + Math.round(Math.random() * 1e9);
    let fileExtension = "";
    if (file.mimetype.indexOf("jpeg") > -1) {
      fileExtension = "jpg"
    } else if (file.mimetype.indexOf("png") > -1) {
      fileExtension = "png";
    } else if (file.mimetype.indexOf("excel") > -1) {
      fileExtension = "xls";
    } else if (file.mimetype.indexOf("spreadsheetml") > -1) {
      fileExtension = "xls";
    } else if (file.mimetype.indexOf("csv") > -1) {
      fileExtension = "csv";
    } else if (file.mimetype.indexOf("pdf") > -1) {
      fileExtension = "pdf";
    }
    const originalName = req.url.split("/")[3];
    cb(null, originalName + '_' + uniqueSuffix + "." + fileExtension);
  };

  static destinationPath(req, file, cb) {
    var foldername = req.url.split("/")[3];
    const dest = `./uploaded/${foldername}`;
    fs.access(dest, function (error) {
      if (error) {
        fs.mkdirSync(dest, { recursive: true });
      }
      return cb(null, dest);
    });
  };

  static RemoveFilesHelper(file) {
    fs.unlink(file, function (err) {
      if (err && err.code == 'ENOENT') {
        console.info("File doesn't exist, won't remove it.");
      } else if (err) {
        console.error("Error occurred while trying to remove file");
      } else {
        console.info(`removed`);
      }
    });
  };
};

export const RemoveFilesHelper = (file: string) => {
  fs.unlink(file, function (err) {
    if (err && err.code == 'ENOENT') {
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      console.error("Error occurred while trying to remove file");
    } else {
      console.info(`removed`);
    }
  });
};

export const PushNotification = async (deviceToken: string, title: string, body: string, key: string) => {
  let serverKey = process.env.SERVER_KEY
  var sender = new gcm.Sender(serverKey);
  var message = new gcm.Message({
    notification: { title: title, body: body },
    data: {
      "customKey": key,
    },
  });
  sender.send(message, { registrationTokens: [deviceToken] }, function (err, response) {
    if (err) console.error(err);
  });
  return message
  try {
    console.log('Push notification sent successfully!');
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

export const calculateAverage = async (numbers: any) => {
  if (numbers.length === 0) {
    return 0; // Handle the case of an empty array
  }

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const average = sum / numbers.length;
  return average;
};

export const diff_weeks = (dt2: any, dt1: any) => {

  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60 * 24 * 7);
  return Math.abs(Math.round(diff));

};

export const countOccurrences = async () => {

};


@Injectable()
export class CronHelper {
  constructor(
    //Silver
    @InjectModel(RoOrder.name) private roOrderModel: Model<RoOrderDocument>,
    @InjectModel(CgOrder.name) private cgOrderModel: Model<CgOrderDocument>,
    @InjectModel(RoInventory.name) private roInventoryModel: Model<RoInventoryDocument>,
    @InjectModel(CgInventory.name) private cgInventoryModel: Model<CgInventoryDocument>,
    @InjectModel(RoConsumption.name) private roConsumptionModel: Model<RoConsumptionDocument>,
    @InjectModel(CgConsumption.name) private cgConsumptionModel: Model<CgConsumptionDocument>,
    @InjectModel(RoMaster.name) private roMasterModel: Model<RoMasterDocument>,
    @InjectModel(SilverProduct.name) private silverProductModel: Model<SilverProductDocument>,
  ) { };

  public async dataXlsx(): Promise<any> {
    try {
      const spreadsheetId = process.env.SPREADSHEETID;
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.CLIENT_EMAIL,
          private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const data = { spreadsheetId: spreadsheetId, auth: auth };
      return data;

    } catch (error) {

    }
  };

  public async getIndianDate(date): Promise<any> {
    var currentTime = new Date(date);


    var options = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };

    var currentIndianTime = currentTime.toLocaleString('en-IN', options as any);
    return `${currentTime.getDate()}/${currentTime.getMonth()}/${currentTime.getFullYear()} ${currentIndianTime}`
  };

  public async readDataInxlsxFile(): Promise<any> {
    const spreadsheetId = process.env.SPREADSHEETID;
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authToken = await auth.getClient();
    const sheet = google.sheets({ version: 'v4', auth: authToken as any });
    try {
      const data = await sheet.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: `FMS!A1:AN`,
      });
      const values = data.data.values;
      console.log('Read data:', values);
      return values;

    } catch (error) {
      console.error("Error reading sheet data:", error.message);
    }


  };

  public async addDataInxlsxFile(dataArray): Promise<any> {
    const spreadsheetId = process.env.SPREADSHEETID;
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const authToken = await auth.getClient();
    const sheet = google.sheets({ version: 'v4', auth: authToken as any });
    try {
      const data = await sheet.spreadsheets.values.get({ spreadsheetId, range: `Partial dispatch!A1:AQ` });
      const existingValues = data.data.values || [];
      const numRows = existingValues.length;
      const startRow = numRows + 1;
      const values = dataArray.map((body, index) => [
        body.Date,
        body.CP_Name,
        body.Item_Code,
        body.Item_Description,
        body.QTY,
        body.Unit,
        body.Order_ID,
        body.Status1,
        body.City,
        body.Pass_Code,
        body.Planned1,
        body.Actual1,
        body.Offer_Number,
        body.link1,
        body.Planned2,
        body.Actual2,
        body.SO_Number,
        body.link2,
        body.Planned3,
        body.Actual3,
        body.Status2,
        body.Dispatch_Qty,
        body.Status3,
        body.link3,
        body.Planned4,
        body.Actual4,
        body.Status4,
        body.link4,
        body.Planned5,
        body.Actual5,
        body.Status5,
        body.link5,
        body.Planned6,
        body.Actual6,
        body.Status6,
        body.link6,
        body.Q4,
        body.Q5,
        body.link7,
        body.Partial_orderId,
      ]);
      const newRange = `Partial dispatch!A${startRow}:${startRow + dataArray.length - 1}`;
      const resource = { values: [...values] };
      const response = await (sheet.spreadsheets.values.update as any)({
        spreadsheetId,
        range: newRange,
        valueInputOption: "USER_ENTERED",
        resource,
      });
      console.log("Sheet updated successfully");
    } catch (error) {
      console.error("Error updating sheet:", error.message);
    }
  };
  // last year same month and next 3 month AVG
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
                        $gte:startDate,
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
        console.log(findSameMonthCon.length,43454354)
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
  // 12 months AVG
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
  // Last 3 months moving AVG
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
        } else {
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

  // For CG
  // RO Sigma Of (Sum of RO TOGs) 
  public async calculateRoSigma(): Promise < number > {
  try {
    const cgInventory = await this.cgInventoryModel.find();
    if(cgInventory.length > 0){
  cgInventory.forEach(async (cg) => {
    const findCgInventory = await this.cgInventoryModel.findOne({ productId: ObjectId(cg.productId), active: true });
    let roInventory = []
    if (findCgInventory) {

      roInventory = await this.roInventoryModel.aggregate([
        { $match: { productId: ObjectId(cg.productId), active: true } },
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
    }

    let roSigma = 0
    if (roInventory.length > 0) {
      roSigma = Math.round(roInventory[0].totalMultipliedByGrowthFactor)
    }
    let togRecommendation = Math.round((roSigma / 4) * Number(cg.plantLeadTime));
    let isConvertFinalToTog = false
    if (findCgInventory && togRecommendation != findCgInventory.oldTogRecommendation) {
      isConvertFinalToTog = true;
    }
   
   togRecommendation =  Math.round(togRecommendation / 10) * 10;
    return await this.cgInventoryModel.findOneAndUpdate({ productId: ObjectId(cg.productId).toString() }, { isConvertFinalToTog: isConvertFinalToTog, roSigma: roSigma, togRecommendation: togRecommendation, growthFactor: "1", roInventoryId: null }, { new: true, useFindAndModify: false });

  })
}

    } catch (e) {
  return 0;
}
  };

  async updateValueInRoInventory() { 
  try {
    const invenData = await this.roInventoryModel.find();
        if (invenData.length > 0) {
          invenData.forEach(async(inven)=>{

            let LYM = inven.LYM;
            let CYM = inven.CYM;
            let L13 = inven.L13;
            let LBS = inven.LBS;
            let SWB = inven.SWB;
            let togRecommendation = inven.togRecommendation;
            let LBSMax = 0;
      
      
            const findConsumption = await this.roConsumptionModel.findOne({
              roId: ObjectId(inven.roId),
              productId: ObjectId(inven.productId)
            });
            if (findConsumption) {
             
              LYM = Number(await this.getAvgWeeklyConsumptionLY4M(inven.roId, inven.productId));
              CYM = Number(await this.getAvgWeeklyConsumptionL12(inven.roId, inven.productId));
              L13 = Number(await this.getAvgWeeklyConsumptionL3(inven.roId, inven.productId));
            }
    
            LBSMax = (Number(Math.max(LYM, CYM, L13))) / 4;
      
            LBS = Number(LBSMax) * Number(inven.leadTime);
      
            SWB = Number(LBSMax) * Number(inven.stockUpWeeks);
      
            togRecommendation = SWB + LBS;
            if (togRecommendation >= 1 && togRecommendation <= 4) {
              togRecommendation = 5;
          }
      
          
            let inventoryObject = {
              togRecommendation:(Math.round(togRecommendation/10)*10),
              LYM: Math.round(LYM),
              CYM: Math.round(CYM),
              L13: Math.round(L13),
              LBS: Math.round(LBS),
              SWB: Math.round(SWB),
              "growthFactor": "1",
              isGrowthFactor: true,
              isConvertFinalToTog: true
            }
      
            await this.roInventoryModel.findByIdAndUpdate({ _id: inven._id, isUpdateInventory: false }, { ...inventoryObject, isUpdateInventory: true }, { new: true, useFindAndModify: false })
          })

    }
  } catch (error) {
    console.log(error)
  }
};

  async updateGrowthFactor(){
  try {
    await this.roInventoryModel.updateMany({ isGrowthFactor: true, isConvertFinalToTog: true })
    // await this.cgInventoryModel.updateMany({isGrowthFactor:true})
  } catch (error) {
    console.log(error)
  }
};
async getCgOpenOrder(productId){
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

async sumOfQualifiedDemand(productId){
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
      // throw new InternalServerErrorException(e);
  }
};

async calculateRoSigm1(productId){
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
      // throw new InternalServerErrorException(e)
  }
};

async updateCgInventory1(){
  try {
    let data = await this.cgInventoryModel.find({ active:true});
   
   data.forEach(async(ele)=>{
    try {
      let date = await dateFormate(new Date());
      let findInventory = await this.cgInventoryModel.findOne({productId: ObjectId(ele.productId)});
      // let silverProduct = await this.silverProductModel.findOne({_id: ObjectId(ele.productId)});

      if (!findInventory) {
          // throw new BadRequestException("Inventory not found")
      }
      let orderRecommendation = 0;
      let onHandStatus = 0;
      let flag = "BLACK"
      let onHandStock = findInventory.onHandStock;
      let qualifiedDemand = 0;

      const openOrder = await this.getCgOpenOrder(ele.productId);

      // For lead time
      let leadTime =Number(findInventory.plantLeadTime );

      let roSigma = await this.calculateRoSigm1(ele.productId);
      let togRecommendation = (roSigma/4)*findInventory.plantLeadTime;
      let sumOfQualifiedDemand = await this.sumOfQualifiedDemand(ele.productId);


      qualifiedDemand = Number(sumOfQualifiedDemand);
      // qualifiedDemand = Number(qualifiedDemandData)+Number(sumOfQualifiedDemand);
      console.log(ele.productId,23423432,qualifiedDemand)

      // For Tog
      let tog = findInventory.tog;
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
          // createdBy: createdBy,
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

          await this.cgOrderModel.deleteMany({
              inventoryId: findInventory._id,
              "cg.stage": "PENDING"
          });

          const highestValueUser = await this.cgOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
          let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;

          let order = new this.cgOrderModel({
              // createdBy: createdBy,
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
      // throw new InternalServerErrorException(e)
  }
   })

    // await this.cgInventoryModel.updateMany({isGrowthFactor:true})
  } catch (error) {
    console.log(error)
  }
};

  async updateStatus(){
  try {
    await this.roInventoryModel.updateMany({ active: true }, { isUpdateInventory: true });
    await this.cgInventoryModel.updateMany({ active: true }, { isUpdateInventory: true });
  } catch (error) {

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
  public async calculateRoSigma1(productId):Promise<number>{
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
            // throw new InternalServerErrorException(e)
        }
    };

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
            // throw new InternalServerErrorException(e)
        }
  };

  public async updateCgInventory(productId,qualifiedDemandData,createdBy){
        try {
            let date = await dateFormate(new Date());
            let findInventory = await this.cgInventoryModel.findOne({productId: ObjectId(productId)});
            let silverProduct = await this.silverProductModel.findOne({_id: ObjectId(productId)});

            if (!findInventory) {
                // throw new BadRequestException("Inventory not found")
            }
            let orderRecommendation = 0;
            let onHandStatus = 0;
            let flag = "BLACK"
            let onHandStock = findInventory.onHandStock;
            let qualifiedDemand = 0;

            const openOrder = await this.getCgOpenOrder(productId);

            // For lead time
            let leadTime =Number(findInventory.plantLeadTime );

            let roSigma = await this.calculateRoSigma1(productId);
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

            } else if (orderRecommendation == 0) {
                await this.cgOrderModel.updateMany({
                    inventoryId: findInventory._id,
                    "cg.stage": "PENDING"
                }, { active: false });
            }
        }
        catch (e) {
            // throw new InternalServerErrorException(e)
        }
    };

    async updateROInventoryFix() {
      try {
        let data = await this.roInventoryModel.find({ active: true });
    
        for (let findInventory of data) {
          // Print the processing log for the specific inventory item
          console.log(`Processing inventory: ${findInventory._id}`);
    
          let date = await dateFormate(new Date());
          let ro = await this.roMasterModel.findOne({ _id: ObjectId(findInventory.roId) });
    
          if (ro == null || !findInventory) {
            continue; // Skip to the next iteration if no inventory or RO found
          }
    
          let orderRecommendation = 0;
          let onHandStatus = 0;
          let flag = "BLACK";
          let onHandStock = findInventory.onHandStock;
          let qualifiedDemand = findInventory.qualifiedDemand;
          let openOrder = await this.getOpenOrder(findInventory.roId, findInventory.productId);
    
          let tog = Number(findInventory.tog) ? Number(findInventory.tog) : findInventory.tog;
          let netFlow = Number(onHandStock + openOrder - qualifiedDemand);
          let moq = findInventory.moq;
          let tog_net = await Math.abs(Number(tog - netFlow));
    
          if (netFlow >= tog) {
            orderRecommendation = 0;
          } else if (tog_net < moq) {
            orderRecommendation = Number(moq);
          } else if (tog_net > moq) {
            orderRecommendation = Math.abs(moq * Math.round(Math.abs(tog_net / moq)));
          }
    
          let orderRecommendationStatus = 0;
          if (isNaN(orderRecommendation)) {
            orderRecommendationStatus = 0;
          } else {
            orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);
          }
    
          let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);
          if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
            onHandStatus = 0;
          } else {
            onHandStatus = onHandStatusNumber;
          }
    
          flag = await flagFunction(tog, onHandStock);
    
          let inventoryObject = {
            tog: tog,
            openOrder: openOrder,
            netFlow: Math.abs(netFlow),
            moq: moq,
            orderRecommendation: orderRecommendation,
            orderRecommendationStatus: orderRecommendationStatus,
            onHandStatus: onHandStatus,
            onHandStock: onHandStock,
            qualifiedDemand: qualifiedDemand,
            flag: flag,
          };
    
          // Update the inventory
          await this.roInventoryModel.findByIdAndUpdate({ _id: findInventory._id }, { ...inventoryObject }, { new: true, useFindAndModify: false });
    
          if (orderRecommendation >= 0) {
            // Deleting pending orders related to the inventory
            const deleteData = await this.roOrderModel.deleteMany({ inventoryId: findInventory._id, "cg.stage": "PENDING", "cg.status": true });
    
            // Get the highest unique number from roOrderModel
            const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
            let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;
    
            // Create a new order based on recommendation
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
            await order.save();
          } else if (orderRecommendation == 0) {
            // Update orders to inactive if recommendation is zero
            await this.roOrderModel.updateMany({
              inventoryId: findInventory._id,
              "cg.stage": "PENDING",
            }, { active: false });
          }
    
          // Check for CG inventory and create or update accordingly
          const cgInventoryExist = await this.cgInventoryModel.findOne({ productId: findInventory.productId });
          if (!cgInventoryExist) {
            await this.createCgInventory(findInventory.productId, orderRecommendation, findInventory.createdBy);
          } else {
            await this.updateCgInventory(findInventory.productId, orderRecommendation, findInventory.createdBy);
          }
    
          // Print log after the entire inventory is processed
          console.log(`Completed processing inventory: ${findInventory._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    
    

//     async updateROInventoryFix(){
//       try {
//         let data = await this.roInventoryModel.find({ active:true});

//         for await(let findInventory of data){
//         // data.forEach(async(findInventory)=>{
       

//           let date = await dateFormate(new Date());
//           // let findInventory = await this.roInventoryModel.findOne({productId:ObjectId(productId),roId:ObjectId(roId)});

//           let ro = await this.roMasterModel.findOne({_id: ObjectId(findInventory.roId)})
//           if(ro == null){
//             return false
//               // throw new BadRequestException("Ro not found")
//           }

//           if (!findInventory) {
//             return false

//               // throw new BadRequestException("Inventory not found")
//           }

//           let orderRecommendation = 0;
//           let onHandStatus = 0;
//           let flag = "BLACK"
//           let onHandStock = findInventory.onHandStock;
//           let qualifiedDemand =findInventory.qualifiedDemand;
//           let openOrder = await this.getOpenOrder(findInventory.roId,findInventory.productId);

//           // For Tog
//           let tog = Number(findInventory.tog) ? Number(findInventory.tog) : findInventory.tog
//           // Fot netFlow 
//           let netFlow = Number(onHandStock + openOrder-qualifiedDemand);
//           // For Moq
//           let moq =findInventory.moq;
//           // For net orderRecommendation
//           let tog_net = await Math.abs(Number(tog - netFlow));
//           if (netFlow >= tog) {
//               orderRecommendation = 0;
//           }
//           else if (tog_net < moq) {
//               orderRecommendation = Number(moq);
//           }
//           else if (tog_net > moq) {
//               orderRecommendation = Math.abs(moq * Math.round(Math.abs(tog_net / moq)));
//           }
//           let orderRecommendationStatus = 0;
//           if (isNaN(orderRecommendation)) {
//               orderRecommendationStatus = 0
//           } else {
//               orderRecommendationStatus = Math.abs(Number(orderRecommendation) * 100 / tog);
//           }
//           let onHandStatusNumber = Math.abs(Number(onHandStock) * 100 / tog);

//           if (onHandStatusNumber == Infinity || isNaN(onHandStatusNumber)) {
//               onHandStatus = 0
//           } else {
//               onHandStatus = onHandStatusNumber
//           }

//           // For onHandStatus
//           flag = await flagFunction(tog, onHandStock);
//           let inventoryObject = {
//               tog:tog,
//               openOrder: openOrder,
//               netFlow: Math.abs(netFlow),
//               moq: moq,
//               orderRecommendation: orderRecommendation,
//               orderRecommendationStatus: orderRecommendationStatus,
//               onHandStatus: onHandStatus,
//               onHandStock: onHandStock,
//               qualifiedDemand: qualifiedDemand,
//               flag: flag,
//           }
// console.log(55555555555)

//           await this.roInventoryModel.findByIdAndUpdate({ _id: findInventory._id }, { ...inventoryObject }, { new: true, useFindAndModify: false })
//           if (orderRecommendation >= 0) {
//               const deleteData  = await this.roOrderModel.deleteMany({inventoryId: findInventory._id,"cg.stage": "PENDING","cg.status":true});
// console.log(deleteData,55555555555)
//               const highestValueUser = await this.roOrderModel.findOne({}, { uniqueNumber: 1 }).sort('-uniqueNumber').exec();
//               let uniqueNumber = highestValueUser ? highestValueUser.uniqueNumber + 1 : 1;

//               let order = new this.roOrderModel({
//                   createdBy: findInventory.createdBy,
//                   qty: Number(orderRecommendation),
//                   inventoryId: findInventory._id,
//                   roId: findInventory.roId,
//                   productId: findInventory.productId,
//                   status: flag,
//                   createdAt: date,
//                   uniqueNumber: uniqueNumber,
//                   "recommendation.qty": Number(orderRecommendation),
//                   "cg.qty": Number(orderRecommendation),
//                   "recommendation.createdAt": date,
//                   "cg.createdAt": date,
//               });
//               order.save();

//           }else if (orderRecommendation == 0) {
// console.log(222222222)

//               await this.roOrderModel.updateMany({
//                   inventoryId: findInventory._id,
//                   "cg.stage": "PENDING"
//               }, { active: false });
//           }

//           const cgInventoryExist = await this.cgInventoryModel.findOne({productId:findInventory.productId})
//           if(!cgInventoryExist){
//              await this.createCgInventory(findInventory.productId,orderRecommendation,findInventory.createdBy);
//           }else{
//              await this.updateCgInventory(findInventory.productId,orderRecommendation,findInventory.createdBy);
//           }
      
//         // })
//         }
       
//       } catch (error) {
//         console.log(error)
//       }
//     };
    async UpdateRoInventory(togData,productId,roId) {
        try {
            let date = await dateFormate(new Date());
            let findInventory = await this.roInventoryModel.findOne({productId:ObjectId(productId),roId:ObjectId(roId)});

            let ro = await this.roMasterModel.findOne({_id: ObjectId(findInventory.roId)})
            if(ro == null){
              return false
                // throw new BadRequestException("Ro not found")
            }

            if (!findInventory) {
              return false

                // throw new BadRequestException("Inventory not found")
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

}