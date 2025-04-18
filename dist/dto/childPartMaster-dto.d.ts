import { PaginationRequestDto } from './pagination-dto';
export declare class CategoryIdArrayDto {
    category: string[];
    exceptids: string[];
}
export declare class FilterPaginationChildPartMasterDto extends PaginationRequestDto {
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
}
export declare class CreateChildPartMasterDto {
}
