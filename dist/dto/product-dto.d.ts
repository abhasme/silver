import { PaginationRequestDto } from './pagination-dto';
export declare class CategoryIdArrayDto {
    category: string[];
    exceptids: string[];
}
export declare class FilterPaginationProductDto extends PaginationRequestDto {
    search: string;
    categories: string[];
    itemCode: [string];
    itemDescription: [string];
    productName: [string];
    subcategoryName: [string];
    categoryName: [string];
    phone: [string];
    active: Boolean;
    unit: [number];
    industry: [string];
    moq: [string];
    factorOfSafety: [string];
    stockUpWeeks: [number];
    leadTime: [number];
    manufactureLeadTime: [number];
    weight: [string];
    productPrice: [string];
    LP: [number];
    HP: [string];
    KW: [string];
    productStage: [string];
    modelNo: [string];
    suc_del: [string];
    discount: [string];
    finalPrice: [string];
    brand: [number];
    group: [number];
    sortBy?: {
        orderKey?: string;
        orderValue?: number;
    }[];
}
export declare class CreateProductDto {
}
