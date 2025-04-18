import { PaginationRequestDto } from 'src/dto/pagination-dto';
export declare class FilterPaginationCgOrderDto extends PaginationRequestDto {
    active: Boolean;
    flag: string;
    flags: [string];
    newField: [string];
    contactPersonName: [string];
    itemCode: [string];
    itemDescription: [string];
    productName: [string];
    industry: [string];
    unit: [string];
    subcategoryName: [string];
    categoryName: [string];
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
    opNumber: [string];
    plant: [string];
    dateRange?: {
        from?: string;
        to?: string;
    }[];
    sortBy?: {
        orderKey?: string;
        orderValue?: number;
    }[];
}
export declare class UpdateCgOrderDto {
    qty: number;
    stage: string;
    partcialDispatch: Boolean;
    changeQty: number;
    isChangeQty: Boolean;
}
export declare class DashboardCgOrderDto {
    active: Boolean;
}
export declare class AddFindValueDto {
    productId: string;
    supplierPartnerId: string;
    qty: number;
}
