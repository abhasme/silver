import { PaginationRequestDto } from 'src/dto/pagination-dto';
export declare class CreateCategoryDto {
    categoryName: string;
    categoryCode: string;
}
export declare class UpdateCategoryDto extends CreateCategoryDto {
}
export declare class StatusCategoryDto {
    categoryid: string;
    active: Boolean;
}
export declare class FilterPaginationUserDto extends PaginationRequestDto {
    active: Boolean;
}
export declare class ImportCategoryDto {
    categoryName: string;
    categoryCode: string;
}
