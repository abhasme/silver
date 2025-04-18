import { PaginationRequestDto } from 'src/dto/pagination-dto';
import { ObjectId } from 'mongoose';
export declare class FilterPaginationRoOrderDto extends PaginationRequestDto {
    dateRange?: {
        from?: string;
        to?: string;
    }[];
    roId: string;
    active: Boolean;
    flag: string;
    flags: [string];
    newField: [string];
    supplierName: [string];
    contactPersonName: [string];
    itemCode: [string];
    itemDescription: [string];
    productName: [string];
    industry: [string];
    unit: [string];
    subcategoryName: [string];
    categoryName: [string];
    recommendedDate1: [string];
    spDate1: [string];
    tog: [number];
    netFlow: [number];
    uniqueNumber: [number];
    qty: [number];
    qualifiedDemand: [number];
    onHandStock: [number];
    createdAt: [string];
    city: [string];
    state: [string];
    openOrder: [number];
    sapNumber: [string];
    roName: [string];
    recommendedQty: [string];
    acceptedBySpQty: [string];
    sortBy?: {
        orderKey?: string;
        orderValue?: number;
    }[];
}
export declare class AddRoIdInfo {
    roId: ObjectId;
}
export declare class UpdateRoOrderDto {
    qty: number;
    stage: string;
    partcialDispatch: Boolean;
    changeQty: number;
    isChangeQty: Boolean;
}
export declare class DashboardRoOrderDto {
    roId: string;
    active: Boolean;
}
