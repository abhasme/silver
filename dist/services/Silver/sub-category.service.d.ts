import { Model } from 'mongoose';
import { Request } from 'express';
import { SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { SilverSubcategory, SilverSubcategoryDocument } from '../../entities/Silver/silverSubCategory';
import { SilverCategoryDocument } from '../../entities/Silver/silverCategory.entity';
import { GetSubcategoryInfoDto } from '../../Silver/silver-sub-category/dto/response-subcategory.dto';
import { FilterPaginationUserDto, CreateSubcategoryDto, StatusSubcategoryDto, UpdateSubcategoryDto } from '../../Silver/silver-sub-category/dto/request-subcategory.dto';
export declare class SilverSubcategoryService {
    private subcategoryModel;
    private productModel;
    private categoryModel;
    constructor(subcategoryModel: Model<SilverSubcategoryDocument>, productModel: Model<SilverProductDocument>, categoryModel: Model<SilverCategoryDocument>);
    createSubcategory(createSubcategoryDto: CreateSubcategoryDto, req: Request): Promise<GetSubcategoryInfoDto>;
    getAllSubcategory(paginationDto: FilterPaginationUserDto): Promise<any>;
    getSubcategoriesByCategoryId(paginationDto: FilterPaginationUserDto): Promise<any>;
    getSubcategoryInfo(id: string): Promise<GetSubcategoryInfoDto>;
    updateSubcategoryInfo(id: string, updateSubcategoryDto: UpdateSubcategoryDto): Promise<SilverSubcategory>;
    deleteSubcategory(id: string): Promise<SilverSubcategory>;
    updateStatus(id: string, statusSubcategoryDto: StatusSubcategoryDto): Promise<SilverSubcategory>;
    importSubCategory(createSubcategoryDto: CreateSubcategoryDto[]): Promise<any>;
}
