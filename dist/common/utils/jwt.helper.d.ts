import { JwtTokenInterface, CustomerJwtTokenInterface } from '../interfaces/jwt.token.interface';
export declare const generateCustomerToken: (tokenDto: CustomerJwtTokenInterface) => Promise<string>;
export declare const generateAuthUserToken: (tokenDto: JwtTokenInterface) => Promise<string>;
export declare const decodeCustomerToken: (token: string) => Promise<false | CustomerJwtTokenInterface>;
export declare const decodeAuthUserToken: (token: string) => Promise<false | JwtTokenInterface>;
export declare const getAuthUserInfo: (headers: any) => Promise<JwtTokenInterface>;
export declare const getCustomerAuthInfo: (headers: any) => Promise<CustomerJwtTokenInterface>;
export declare const destroyCustomerToken: (headers: any) => Promise<false | any>;
export declare const checkBlank: (property: any, errorMessage: any) => Promise<string>;
export declare const checkExist: (property: any, errorMessage: any) => Promise<string>;
export declare const dateFormate: (date: any) => Promise<string>;
export declare const addDays: (startDate: any, daysToAdd: any) => Promise<Date>;
export declare const duplicateRemove: (data: any) => Promise<any[]>;
export declare const excelDateToYYYYMMDD: (excelDateSerialNumber: any) => Date;
export declare const flagFunction: (tog: any, onHandStock: any) => Promise<string>;
export declare const multiSelectorFunction: (paginationDto: any) => {};
export declare const monthDifference: (startDate: any, endDate: any) => number;
export declare const formatDate: (date: any) => Promise<string>;
export declare const calculateDateRangeForCym: (today: any) => Promise<{
    startDate: string;
    endDate: string;
}>;
export declare const calculateDateRangeForLYM: (currentMonth: any, currentYear: any) => Promise<{
    startDate: string;
    endDate: string;
}>;
export declare const around: (a: any) => Promise<boolean>;
