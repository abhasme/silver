import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Request } from 'express';
import { SilverBrand, SilverBrandDocument } from '../../entities/Silver/silverBrand.entity';
import { UserDocument } from '../../entities/users.entity';
import { SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { SearchDto } from 'src/dto/pagination-dto';
import { GetBrandInfoDto } from '../../Silver/brand/dto/response-brand.dto';
import { CreateBrandDto, FilterPaginationBrandDto, UpdateStatusBrandDto, UpdateBrandDto } from '../../Silver/brand/dto/request-brand.dto';
export declare class BrandService {
    private silverProductModel;
    private userModel;
    private brandModel;
    constructor(silverProductModel: Model<SilverProductDocument>, userModel: Model<UserDocument>, brandModel: Model<SilverBrandDocument>);
    createBrand(createBrandDto: CreateBrandDto, req: Request): Promise<BadRequestException | GetBrandInfoDto>;
    getAllBrand(paginationDto: FilterPaginationBrandDto, req: Request): Promise<any>;
    getBrandInfo(id: string): Promise<any>;
    deleteBrand(id: string): Promise<SilverBrand>;
    UpdateBrand(id: string, updateBrandDto: UpdateBrandDto): Promise<SilverBrand>;
    getBrandDropDown(searchDto: SearchDto, req: Request): Promise<any>;
    updateBrandStatus(id: string, updateStatusBrandDto: UpdateStatusBrandDto): Promise<SilverBrand>;
}
