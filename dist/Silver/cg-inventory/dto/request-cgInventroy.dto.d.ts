import { PaginationRequestDto } from 'src/dto/pagination-dto';
import { ObjectId } from "mongoose";
export declare class CreateCgInventoryDto {
    productId: ObjectId;
    consumptionId: ObjectId;
    orderId: ObjectId;
    onHandStock: number;
    qualifiedDemand: number;
    leadTime: number;
    stockUpWeeks: number;
    growthFactor: string;
    tog: number;
    plantLeadTime: number;
    moq: number;
}
export declare class UpdateCgInventoryDto {
    productId: ObjectId;
    consumptionId: ObjectId;
    orderId: ObjectId;
    onHandStock: number;
    qualifiedDemand: number;
    leadTime: number;
    plantLeadTime: number;
    stockUpWeeks: number;
    growthFactor: string;
    tog: number;
    moq: number;
}
export declare class UpdateTogToggleDto {
    isUpdateTog: Boolean;
}
export declare class FilterPaginationCgInventoryDto extends PaginationRequestDto {
    active: Boolean;
    status: string;
    onHandStock: [number];
    qualifiedDemand: [number];
    leadTime: [number];
    growthFactor: [number];
    avgWeeklyConsumption: [number];
    flag: [string];
    itemDescription: [string];
    productName: [string];
    contactPersonName: [string];
    itemCode: [string];
    tog: [number];
    netFlow: [number];
    avg: [number];
    unit: [number];
    orderRecommendation: [number];
    moq: [string];
    city: [string];
    state: [string];
    companyName: string[];
    createdAt: [string];
    orderRecommendationStatus: [string];
    openOrder: [number];
    plantLeadTime: [number];
    togRecommendation: [string];
    group: [string];
    roSigma: [number];
    onHandStatus: [string];
    sortBy?: {
        orderKey?: string;
        orderValue?: number;
    }[];
}
export declare class UpdateStatusCgInventoryDto {
    active: Boolean;
}
export declare class GetDashBoardCgInventoryInfo {
    active: Boolean;
}
export declare class ImportCgInventoryDto {
    productName: string;
    moq: string;
    tog: number;
    onHandStock: number;
    qualifiedDemand: number;
    leadTime: number;
    stockUpWeeks: number;
    growthFactor: string;
}
export declare class ViewOtherCgInventoryDto {
    productId: ObjectId;
}
export declare class ChangeTogDto {
    isConvertFinalToTog: Boolean;
    isUpdateTog: Boolean;
    isNoTogChange: Boolean;
    tog: string;
}
