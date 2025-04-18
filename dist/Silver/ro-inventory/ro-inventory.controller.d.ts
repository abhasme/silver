import { RoInventoryService } from '../../services/Silver/ro-inventory.service';
import { AddRoIdInfo, ChangeTogDto, CreateRoInventoryDto, FilterPaginationRoInventoryDto, GetDashBoardRoInventoryInfo, ImportRoInventoryAndUpdateStockDto, ImportRoInventoryDto, UpdateRoInventoryDto, UpdateStatusRoInventoryDto, UpdateTogToggleDto, ViewotherRoInventoryDto } from './dto/request-roInventroy.dto';
import { GetRoInventoryInfoDto } from './dto/response-roInventory.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { SearchDto } from 'src/dto/pagination-dto';
export declare class RoInventoryController {
    private readonly roInventoryService;
    constructor(roInventoryService: RoInventoryService);
    protected createInventory(req: Request, createInventoryDto: CreateRoInventoryDto): Promise<any>;
    protected getAllInventory(req: Request, paginationDto: FilterPaginationRoInventoryDto): Promise<SuccessResponse<any>>;
    protected getInventoryInfo(id: string): Promise<SuccessResponse<GetRoInventoryInfoDto>>;
    protected updateInventoryStatus(id: string, updateStatusInventoryDto: UpdateStatusRoInventoryDto): Promise<SuccessResponse<any>>;
    protected changeTog(id: string, changeTogDto: ChangeTogDto): Promise<SuccessResponse<any>>;
    protected UpdateInventory(id: string, updateInventoryDto: UpdateRoInventoryDto, req: Request): Promise<SuccessResponse<any>>;
    protected getDashBoardInventoryInfo(getDashBoardInventoryInfo: GetDashBoardRoInventoryInfo, req: Request): Promise<any>;
    protected getInventoryDropDown(req: Request, addRoIdInfo: AddRoIdInfo): Promise<SuccessResponse<any>>;
    protected importInventory(createInventoryDto: ImportRoInventoryDto[], req: Request): Promise<any>;
    protected importInventoryAndUpdateStock(createInventoryDto: ImportRoInventoryAndUpdateStockDto[], req: Request): Promise<any>;
    protected getInventoryMoreInfo(viewotherInventoryDto: ViewotherRoInventoryDto): Promise<any>;
    protected getProductDropDown(req: Request, searchDto: SearchDto): Promise<SuccessResponse<any>>;
    protected UpdateTogToggle(id: string, updateTogToggleDto: UpdateTogToggleDto, req: Request): Promise<SuccessResponse<any>>;
    protected UpdateTogRecommendation(): Promise<SuccessResponse<any>>;
}
