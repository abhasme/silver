/// <reference types="multer" />
import { SilverSubcategoryService } from '../../services/Silver/sub-category.service';
import { CreateSubcategoryDto, StatusSubcategoryDto, UpdateSubcategoryDto } from './dto/request-subcategory.dto';
import { GetSubcategoryInfoDto } from './dto/response-subcategory.dto';
import { FilterPaginationUserDto } from './dto/request-subcategory.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
export declare class SilverSubCategoryController {
    private readonly silverSubcategoryService;
    constructor(silverSubcategoryService: SilverSubcategoryService);
    protected createSubcategory(req: Request, createSubcategoryDto: CreateSubcategoryDto, files: {
        image?: Express.Multer.File[];
    }): Promise<any>;
    protected getAllSubcategory(req: Request, paginationDto: FilterPaginationUserDto): Promise<SuccessResponse<any>>;
    protected getSubcategoriesByCategoryId(req: Request, paginationDto: FilterPaginationUserDto): Promise<SuccessResponse<any>>;
    protected getSubcategoryInfo(id: string): Promise<SuccessResponse<GetSubcategoryInfoDto>>;
    protected updateSubcategoryInfo(id: string, updateSubcategoryDto: UpdateSubcategoryDto, files: {
        image?: Express.Multer.File[];
    }): Promise<any>;
    protected deleteSubcategory(id: string): Promise<import("../../entities/Silver/silverSubCategory").SilverSubcategory>;
    protected updateStatus(id: string, statusSubcategoryDto: StatusSubcategoryDto): Promise<SuccessResponse<any>>;
    protected importSubCategory(createSubcategoryDto: CreateSubcategoryDto[]): Promise<any>;
}
