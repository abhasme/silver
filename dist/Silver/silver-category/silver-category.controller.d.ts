import { SilverCategoryService } from '../../services/Silver/category.service';
import { CreateCategoryDto, ImportCategoryDto, StatusCategoryDto, UpdateCategoryDto, FilterPaginationUserDto } from '../silver-category/dto/request-category.dto';
import { GetCategoryInfoDto } from '../silver-category/dto/response-category.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { SearchDto } from 'src/dto/pagination-dto';
export declare class SilverCategoryController {
    private readonly silverCategoryService;
    constructor(silverCategoryService: SilverCategoryService);
    protected createCategory(req: Request, createCategoryDto: CreateCategoryDto): Promise<any>;
    protected getAllCategories(req: Request, paginationDto: FilterPaginationUserDto): Promise<SuccessResponse<any>>;
    protected getCategoryInfo(id: string): Promise<SuccessResponse<GetCategoryInfoDto>>;
    protected updateCategoryInfo(id: string, updateCategoryDto: UpdateCategoryDto): Promise<any>;
    protected deleteCategory(id: string): Promise<import("../../entities/Silver/silverCategory.entity").SilverCategory>;
    protected updateStatus(id: string, statusCategoryDto: StatusCategoryDto): Promise<SuccessResponse<any>>;
    protected importSubCategory(req: Request, importCategoryDto: ImportCategoryDto[]): Promise<any>;
    protected getCategoryDropDown(searchDto: SearchDto): Promise<SuccessResponse<any>>;
}
