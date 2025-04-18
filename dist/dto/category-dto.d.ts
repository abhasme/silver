import { ObjectId } from "mongoose";
import { PaginationRequestDto } from './pagination-dto';
export declare class CreateCategoryDto {
    categoryName: string;
    categoryDescription: string;
    categoryImage: string;
    createdBy: ObjectId;
}
export declare class CreateSubCategoryDto {
    subcategoryName: string;
    subcategoryDescription: string;
    subcategoryImage: string;
    categoryid: ObjectId;
    createdBy: ObjectId;
}
export declare class FilterPaginationCategoryDto extends PaginationRequestDto {
}
