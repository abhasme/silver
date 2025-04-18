import { CgInventoryService } from '../../services/Silver/cg-inventory.service';
import { ChangeTogDto, CreateCgInventoryDto, FilterPaginationCgInventoryDto, GetDashBoardCgInventoryInfo, ImportCgInventoryDto, UpdateCgInventoryDto, UpdateStatusCgInventoryDto, UpdateTogToggleDto, ViewOtherCgInventoryDto } from './dto/request-cgInventroy.dto';
import { GetCgInventoryInfoDto } from './dto/response-cgInventory.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { SearchDto } from 'src/dto/pagination-dto';
export declare class CgInventoryController {
    private readonly cgInventoryService;
    constructor(cgInventoryService: CgInventoryService);
    protected createInventory(req: Request, createInventoryDto: CreateCgInventoryDto): Promise<any>;
    protected getAllInventory(req: Request, paginationDto: FilterPaginationCgInventoryDto): Promise<SuccessResponse<any>>;
    protected getInventoryInfo(id: string): Promise<SuccessResponse<GetCgInventoryInfoDto>>;
    protected updateInventoryStatus(id: string, updateStatusInventoryDto: UpdateStatusCgInventoryDto): Promise<SuccessResponse<any>>;
    protected UpdateInventory(id: string, updateCgInventoryDto: UpdateCgInventoryDto, req: Request): Promise<SuccessResponse<any>>;
    protected getDashBoardInventoryInfo(getDashBoardCgInventoryInfo: GetDashBoardCgInventoryInfo, req: Request): Promise<any>;
    protected getInventoryDropDown(req: Request): Promise<SuccessResponse<any>>;
    protected importInventory(createInventoryDto: ImportCgInventoryDto[], req: Request): Promise<any>;
    protected getInventoryMoreInfo(viewotherCgInventoryDto: ViewOtherCgInventoryDto): Promise<any>;
    protected getProductDropDown(req: Request, searchDto: SearchDto): Promise<SuccessResponse<any>>;
    protected UpdateTogToggle(id: string, updateTogToggleDto: UpdateTogToggleDto, req: Request): Promise<SuccessResponse<any>>;
    protected changeTog(id: string, changeTogDto: ChangeTogDto): Promise<SuccessResponse<any>>;
}
