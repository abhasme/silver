import { PaginationRequestDto } from './pagination-dto';
export declare class FilterPaginationRotexConsumptionDto extends PaginationRequestDto {
    qty: [number];
    itemDescription: [string];
    productName: [string];
    subCategoryName: [string];
    categoryName: [string];
    itemCode: [string];
    rotexName: [string];
    active: Boolean;
    createdAt: [string];
    date: [string];
    openOrder: [number];
    qualifiedDemand: [number];
    unit: [number];
}
