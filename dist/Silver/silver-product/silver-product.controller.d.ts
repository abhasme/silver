import { SilverProductsService } from '../../services/Silver/product.service';
import { CreateProductDto, StatusProductDto, ImportProductDto, UpdateProductDto } from './dto/request-product.dto';
import { SuccessResponse } from 'src/common/interfaces/response';
import { Request } from 'express';
import { FilterPaginationProductDto } from 'src/dto/product-dto';
import { SearchDto } from 'src/dto/pagination-dto';
export declare class SilverProductController {
    private readonly silverProductsService;
    constructor(silverProductsService: SilverProductsService);
    protected createProduct(req: Request, createProductDto: CreateProductDto): Promise<any>;
    protected getAllProduct(req: Request, paginationDto: FilterPaginationProductDto): Promise<SuccessResponse<any>>;
    protected getProductInfo(id: string): Promise<SuccessResponse<any>>;
    protected UpdateProducts(id: string, productIdDto: UpdateProductDto): Promise<SuccessResponse<any>>;
    protected deleteCategory(id: string): Promise<import("../../entities/Silver/silverProductMaster").SilverProduct>;
    protected importProducts(req: Request, createProductDto: ImportProductDto[]): Promise<any>;
    protected getProductDropDown(req: Request, searchDto: SearchDto): Promise<SuccessResponse<any>>;
    protected updateStatus(id: string, statusProductDto: StatusProductDto): Promise<SuccessResponse<any>>;
}
