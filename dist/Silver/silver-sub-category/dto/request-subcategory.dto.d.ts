import { PaginationRequestDto } from 'src/dto/pagination-dto';
export declare class CreateSubcategoryDto {
    subcategoryName: string;
    categoryid: string;
    categoryName: string;
    subCategoryCode: string;
}
export declare class UpdateSubcategoryDto extends CreateSubcategoryDto {
}
export declare class StatusSubcategoryDto {
    subcategoryid: string;
    active: Boolean;
}
export declare class FilterPaginationUserDto extends PaginationRequestDto {
    categoryId: string;
    active: Boolean;
}
