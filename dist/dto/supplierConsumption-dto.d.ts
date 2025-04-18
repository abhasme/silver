import { PaginationRequestDto } from './pagination-dto';
export declare class FilterPaginationSupplierConsumptionDto extends PaginationRequestDto {
    qty: [number];
    itemDescription: [string];
    productName: [string];
    subCategoryName: [string];
    categoryName: [string];
    itemCode: [string];
    cpName: [string];
    supplierPartnerId: string;
    active: Boolean;
    createdAt: [string];
    date: [string];
    opNumber: [string];
    openOrder: [number];
    qualifiedDemand: [number];
    unit: [number];
}
