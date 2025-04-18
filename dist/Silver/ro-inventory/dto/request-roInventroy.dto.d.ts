import { PaginationRequestDto } from 'src/dto/pagination-dto';
import { ObjectId } from "mongoose";
export declare class CreateRoInventoryDto {
    roId: ObjectId;
    productId: ObjectId;
    consumptionId: ObjectId;
    orderId: ObjectId;
    onHandStock: number;
    qualifiedDemand: number;
    leadTime: number;
    stockUpWeeks: number;
    growthFactor: number;
    tog: number;
    moq: string;
}
export declare class UpdateRoInventoryDto {
    roId: ObjectId;
    productId: ObjectId;
    consumptionId: ObjectId;
    orderId: ObjectId;
    onHandStock: number;
    qualifiedDemand: number;
    leadTime: number;
    growthFactor: number;
    tog: number;
    stockUpWeeks: number;
    moq: number;
}
export declare class UpdateTogToggleDto {
    isUpdateTog: Boolean;
}
export declare class FilterPaginationRoInventoryDto extends PaginationRequestDto {
    roId: string;
    onHandStock: [number];
    qualifiedDemand: [number];
    leadTime: [number];
    factorOfSafety: [number];
    avgWeeklyConsumption: [number];
    active: Boolean;
    flag: [string];
    itemDescription: [string];
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
    roName: string[];
    status: string;
    createdAt: [string];
    productName: [string];
    group: [string];
    branch: [string];
    LYM: [string];
    CYM: [string];
    L13: [string];
    LBS: [string];
    SWB: [string];
    togRecommendation: [string];
    growthFactor: [string];
    onHandStatus: [string];
    stockUpWeeks: [string];
    orderRecommendationStatus: [string];
    openOrder: [number];
    sortBy?: {
        orderKey?: string;
        orderValue?: number;
    }[];
}
export declare class UpdateStatusRoInventoryDto {
    active: Boolean;
}
export declare class GetDashBoardRoInventoryInfo {
    roId: ObjectId;
    active: Boolean;
}
export declare class ImportRoInventoryDto {
    productName: string;
    roName: string;
    tog: number;
    onHandStock: number;
    qualifiedDemand: number;
    leadTime: number;
    stockUpWeeks: number;
    active: boolean;
}
export declare class ViewotherRoInventoryDto {
    roId: ObjectId;
    productId: ObjectId;
}
export declare class AddRoIdInfo {
    roId: ObjectId;
}
export declare class ChangeTogDto {
    isConvertFinalToTog: Boolean;
    isGrowthFactor: Boolean;
    isNoTogChange: Boolean;
    growthFactor: string;
    tog: string;
}
export declare class ImportRoInventoryAndUpdateStockDto {
    productName: string;
    roName: string;
    onHandStock: number;
    consumption: string;
}
