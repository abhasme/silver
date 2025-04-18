import * as jwt from 'jsonwebtoken';
import { JwtTokenInterface, CustomerJwtTokenInterface } from '../interfaces/jwt.token.interface';
import * as dotenv from 'dotenv';

dotenv.config();
export const generateCustomerToken = async (tokenDto: CustomerJwtTokenInterface): Promise<string> => {
  return await jwt.sign(tokenDto, process.env.JWT_SECRET, {
    expiresIn:  1 * 60 * 60 * 1000,
  });
};

export const generateAuthUserToken = async (tokenDto: JwtTokenInterface): Promise<string> => {
  return await jwt.sign(tokenDto, process.env.JWT_SECRET, {
    expiresIn:  1 * 60 * 60 * 1000,
  });
};

export const decodeCustomerToken = async (token: string): Promise<false | CustomerJwtTokenInterface> => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET) as CustomerJwtTokenInterface;
  } catch (e) {
    return false;
  }
};

export const decodeAuthUserToken = async (token: string): Promise<false | JwtTokenInterface> => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET) as JwtTokenInterface;
  } catch (e) {
    return false;
  }
};

export const getAuthUserInfo = async (headers: any): Promise<JwtTokenInterface> => {
  try {
    const authHeader = headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET) as JwtTokenInterface;
  } 
  catch (e) {
    return {};
  }
};

export const getCustomerAuthInfo = async (headers: any): Promise<CustomerJwtTokenInterface> => {
  try {
    const authHeader = headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    return jwt.verify(token, process.env.JWT_SECRET) as CustomerJwtTokenInterface;
  } catch (e) {
    return {};
  }
};

export const destroyCustomerToken = async (headers: any): Promise<false | any> => {
  const authHeader = headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    return await decodeCustomerToken(token);
};

export const checkBlank = async(property:any, errorMessage:any) => {
  let errString = ""
  if (property === "" || property === null || property === "null") {
     return errString += `${errorMessage} ,`;
  }
};

export const checkExist = async(property:any, errorMessage:any) => {
  let errString = ""
  if (!property) {
    return errString += `${errorMessage} ,`;
  }
};

export const dateFormate = async(date) => {
  const utcDate = new Date(date);
  const istOffsetMilliseconds = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
  const istDate = new Date(utcDate.getTime() + istOffsetMilliseconds);
  const formattedIST = istDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  return formattedIST
};

export const addDays=async (startDate, daysToAdd) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + daysToAdd);
  return date;
};

export const duplicateRemove =async (data) => {
const uniqueData = [];
const seen = {};

for (const item of data) {
  const key = `${item.roId}_${item.productId}`;
  if (!seen[key]) {
      seen[key] = true;
      uniqueData.push(item);
  }
}
return uniqueData
};

export const excelDateToYYYYMMDD=(excelDateSerialNumber)=> {
  const millisecondsPerDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
  const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's epoch (December 30, 1899)

  // Calculate the date in milliseconds
  const dateInMilliseconds = excelEpoch.getTime() + excelDateSerialNumber * millisecondsPerDay;

  // Create a JavaScript date object
  const jsDate = new Date(dateInMilliseconds);

  return jsDate;
};

export const flagFunction = async (tog,onHandStock)=> {
  let flag = "WHIGHT"
  try {
     // For onHandStatus
     let percentOf33 = (33 * Number(tog)) / 100
     let percentOf66 = (66 * Number(tog)) / 100

     if (onHandStock > tog) {
       flag = "WHIGHT";

     } else if (onHandStock <= 0) {
       flag = "BLACK";

     }
     else if (onHandStock > 0 && onHandStock <= percentOf33) {
       flag = "RED";

     }
     else if (onHandStock > percentOf33 && onHandStock <= percentOf66) {
       flag = "YELLOW";

     }
     else if (onHandStock <= tog && onHandStock > percentOf66) {
       flag = "GREEN";
     }
return flag;
  } catch (error) {
return flag;
    
  }
};

export const multiSelectorFunction = (paginationDto) => {
  try {
    const condition = {};
    const filterFields = [
      "discount",
      "finalPrice",
      "dateRange",
      "orderPlacementDate1",
      "spDate1",
      "recommendedDate1",
      "roSigma",
      "acceptedBySpQty",
      "recommendedQty",
      "onHandStatus",
      "phone",
      "address",
      "flags",
      "newField",
      "firmName",
      "roName",
      "LP",
      "HP",
      "KW",
      "productStage",
      "modelNo",
      "suc_del",
      "group",
      "brand",
      "growthFactor",
      "plantLeadTime",
      "weight",
      "productPrice",
      "finalTog",
      "oldTog",
      "togRecommendation",
      "SWB",
      "LBS",
      "L13",
      "CYM",
      "LYM",
      'qty',
      'moq',
      "avg",
      'tog',
      'city',
      'unit',
      "date",
      "email",
      'state',
      'cpName',
      'netFlow',
      "industry",
      "firstName",
      "createdAt",
      "firmName",
      "userType",
      "stockUpWeeks",
      'leadTime',
      "cpRemark",
      "spRemark",
      'itemCode',
      'openOrder',
      "sapNumber",
      'companyName',
      'supplierName',
      'productName',
      "rotexRemark",
      "opNumber",
      "plant",
      "cpDate",
      "cpDate1",
      'onHandStock',
      'categoryName',
      "uniqueNumber",
      'factorOfSafety',
      'itemDescription',
      'subCategoryName',
      'qualifiedDemand',
      "subcategoryName",
      'contactPersonName',
      "orderPlacementDate",
      'orderRecommendation',
      "manufactureleadTime",
      'avgWeeklyConsumption',
      "expectedDeliveryDays",
      "expectedDeliveryDate",
      "orderRecommendationStatus"
    ];
    filterFields.forEach((field) => {
      if (paginationDto[field] && paginationDto[field].length > 0) {
        if(field === ('createdAt')) {
          condition['$or'] = paginationDto.createdAt.map((ele) => ({
            $expr: {
              $eq: [
                { $dateFromString: { dateString: ele , format: '%d-%m-%Y', } },
              {  $dateFromString: {
                  dateString: { $dateToString: { date: '$createdAt', format: '%d-%m-%Y' } },
                  format: '%d-%m-%Y'
                }}
              ]
            },
          }));
        }else if (field === 'orderPlacementDate') {
          condition['$or'] = paginationDto.date.map((ele) => ({
          
            $expr: {
              $eq: [
                { $dateFromString: { dateString: ele , format: '%d-%m-%Y', } },
              {  $dateFromString: {
                  dateString: { $dateToString: { date: '$orderPlacementDate', format: '%d-%m-%Y' } },
                  format: '%d-%m-%Y'
                }}
              ]
            },
          }));
        }else if (field === 'expectedDeliveryDate') {
          condition['$or'] = paginationDto.date.map((ele) => ({
          
            $expr: {
              $eq: [
                { $dateFromString: { dateString: ele , format: '%d-%m-%Y', } },
              {  $dateFromString: {
                  dateString: { $dateToString: { date: '$expectedDeliveryDate', format: '%d-%m-%Y' } },
                  format: '%d-%m-%Y'
                }}
              ]
            },
          }));
        }else if (field === 'date') {
          condition['$or'] = paginationDto.date.map((ele) => ({
          
            $expr: {
              $eq: [
                { $dateFromString: { dateString: ele , format: '%d-%m-%Y', } },
              {  $dateFromString: {
                  dateString: { $dateToString: { date: '$date', format: '%d-%m-%Y' } },
                  format: '%d-%m-%Y'
                }}
              ]
            },
          }));
        }else if (field === 'itemDescription') {
          condition['$or']= paginationDto.itemDescription.map((ele) => ({itemDescription:ele}))
          
        }else if(field === 'cpDate1'){

          condition['$or'] = 
         [ { $and: [
              { cpDate1: { $gte: new Date(paginationDto.cpDate1[0].from) } }, 
              { cpDate1: { $lte: new Date(paginationDto.cpDate1[0].to) } }
          ]}]
        }else if(field === 'dateRange'){
          condition['$or'] = 
         [ { $and: [
              { dateRange: { $gte: new Date(paginationDto.dateRange[0].from) } }, 
              { dateRange: { $lte: new Date(paginationDto.dateRange[0].to) } }
          ]}]
        }else {
        condition[field] = { $in: paginationDto[field] };
        }
      }
    });

    
    
    if (Object.keys(condition).length > 0) {
      return condition;
    }

    return {};
  } catch (error) {
    return {};
  }
};

export const monthDifference = (startDate, endDate)=> {
    const yearsDifference = endDate.getFullYear() - startDate.getFullYear();
    const monthsDifference = endDate.getMonth() - startDate.getMonth();
    return yearsDifference * 12 + monthsDifference;
};


export const formatDate = async(date) => {
  let year = date.getFullYear();
  let month = ('0' + (date.getMonth() + 1)).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};


export const calculateDateRangeForCym = async(today) =>{
  let currentDate = new Date(today);

  let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  let startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());

 

  return {
      startDate: await formatDate(startDate),
      endDate: await formatDate(endDate)
  };
};


export const calculateDateRangeForLYM = async(currentMonth, currentYear)=> {
  let currentMonth1 = currentMonth
  let startMonth = currentMonth1;
  let startYear = currentYear - 1;

 
  let endMonth = (currentMonth1 + 3) % 12;
  let endYear = startYear;
  if (currentMonth1 + 3 > 11) {
      endYear += 1;
  }

  
  let startDate = new Date(startYear, startMonth, 1);
  let endDate = new Date(endYear, endMonth + 1, 0); 

  return {
      startDate: await formatDate(startDate),
      endDate: await formatDate(endDate)
  };
};


export const around=async(a)=> {
  if (a >= 0 && a <= 4) {
    a = 5;
}
  let aroundValue = Math.round(a / 10) * 10;
  return a === aroundValue;
};
