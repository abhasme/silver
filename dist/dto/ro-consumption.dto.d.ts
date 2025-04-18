import { PaginationRequestDto } from './pagination-dto';
export declare class FilterPaginationRoConsumptionDto extends PaginationRequestDto {
    qty: [number];
    itemDescription: [string];
    productName: [string];
    subCategoryName: [string];
    categoryName: [string];
    itemCode: [string];
    roName: [string];
    roId: string;
    active: Boolean;
    createdAt: [string];
    date: [string];
    openOrder: [number];
    qualifiedDemand: [number];
    unit: [number];
    dateRange?: {
        from?: string;
        to?: string;
    }[];
    sortBy?: {
        orderKey?: string;
        orderValue?: number;
    }[];
}
