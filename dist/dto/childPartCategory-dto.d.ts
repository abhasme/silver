import { ObjectId } from "mongoose";
import { PaginationRequestDto } from './pagination-dto';
export declare class CreateChildPartCategoryDto {
    categoryName: string;
    categoryDescription: string;
    categoryImage: string;
    createdBy: ObjectId;
}
export declare class CreateChildPartSubCategoryDto {
    subcategoryName: string;
    subcategoryDescription: string;
    subcategoryImage: string;
    categoryid: ObjectId;
    createdBy: ObjectId;
}
export declare class FilterPaginationChildPartCategoryDto extends PaginationRequestDto {
}
