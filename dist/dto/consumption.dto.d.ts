import { PaginationRequestDto } from './pagination-dto';
export declare class FilterPaginationConsumptionDto extends PaginationRequestDto {
    qty: [number];
    itemDescription: [string];
    productName: [string];
    subCategoryName: [string];
    categoryName: [string];
    itemCode: [string];
    cpName: [string];
    channelPartnerId: string;
    active: Boolean;
    createdAt: [string];
    date: [string];
    openOrder: [number];
    qualifiedDemand: [number];
    unit: [number];
}
