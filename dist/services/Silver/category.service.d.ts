import { Model } from 'mongoose';
import { Request } from 'express';
import { SilverCategory, SilverCategoryDocument } from '../../entities/Silver/silverCategory.entity';
import { SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { SilverSubcategoryDocument } from '../../entities/Silver/silverSubCategory';
import { CreateCategoryDto, FilterPaginationUserDto, ImportCategoryDto, StatusCategoryDto, UpdateCategoryDto } from '../../Silver/silver-category/dto/request-category.dto';
import { GetCategoryInfoDto } from '../../Silver/silver-category/dto/response-category.dto';
import { SearchDto } from 'src/dto/pagination-dto';
export declare class SilverCategoryService {
    private categoryModel;
    private productModel;
    private subcategoryModel;
    constructor(categoryModel: Model<SilverCategoryDocument>, productModel: Model<SilverProductDocument>, subcategoryModel: Model<SilverSubcategoryDocument>);
    createCategory(createCategoryDto: CreateCategoryDto, req: Request): Promise<GetCategoryInfoDto>;
    getAllCategories(paginationDto: FilterPaginationUserDto): Promise<any>;
    getCategoryInfo(id: string): Promise<GetCategoryInfoDto>;
    updateCategoryInfo(id: string, updateCategoryDto: UpdateCategoryDto): Promise<SilverCategory>;
    deleteCategory(id: string): Promise<SilverCategory>;
    updateStatus(id: string, statusCategoryDto: StatusCategoryDto): Promise<SilverCategory>;
    importCategory(req: Request, importCategoryDto: ImportCategoryDto[]): Promise<any>;
    getCategoryDropDown(searchDto: SearchDto): Promise<any>;
}
