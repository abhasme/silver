import { BrandService } from '../../services/Silver/brand.service';
import { CreateBrandDto, UpdateStatusBrandDto, FilterPaginationBrandDto, UpdateBrandDto } from './dto/request-brand.dto';
import { GetBrandInfoDto } from './dto/response-brand.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { SearchDto } from 'src/dto/pagination-dto';
export declare class BrandController {
    private readonly brandService;
    constructor(brandService: BrandService);
    protected createBrand(req: Request, createBrandDto: CreateBrandDto): Promise<any>;
    protected getAllBrand(req: Request, paginationDto: FilterPaginationBrandDto): Promise<SuccessResponse<any>>;
    protected getBrandInfo(id: string): Promise<SuccessResponse<GetBrandInfoDto>>;
    protected deleteBrand(id: string): Promise<import("../../entities/Silver/silverBrand.entity").SilverBrand>;
    protected UpdateBrand(id: string, updateBrandIdDto: UpdateBrandDto): Promise<SuccessResponse<any>>;
    protected getBrandDropDown(req: Request, searchDto: SearchDto): Promise<SuccessResponse<any>>;
    protected updateBrandStatus(id: string, updateBrandStatusDto: UpdateStatusBrandDto): Promise<SuccessResponse<any>>;
}
