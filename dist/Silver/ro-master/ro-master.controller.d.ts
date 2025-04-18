import { RoMasterService } from '../../services/Silver/ro-master.service';
import { SuccessResponse } from '../../common/interfaces/response';
import { CreateRoMasterDto, ImportRoMasterDto, UpdateRoMasterDto, UpdateStatusRoMasterDto } from './dto/request-roMaster.dto';
import { Request } from 'express';
import { FilterPaginationRoMasterDto } from 'src/dto/roMaster.dto';
export declare class RoMasterController {
    private readonly roMasterService;
    constructor(roMasterService: RoMasterService);
    protected getAllRoMaster(req: Request, paginationDto: FilterPaginationRoMasterDto): Promise<SuccessResponse<any>>;
    protected createRo(req: Request, createRoMasterDto: CreateRoMasterDto): Promise<any>;
    protected getRoMasterInfo(id: string): Promise<SuccessResponse<any>>;
    protected UpdateRoMaster(id: string, RoMasterIdDto: UpdateRoMasterDto): Promise<SuccessResponse<any>>;
    protected deleteRoMaster(id: string): Promise<import("../../entities/Silver/roMaster").RoMaster>;
    protected importRoMaster(req: Request, importRoMasterDto: ImportRoMasterDto[]): Promise<any>;
    protected getRoMasterDropDown(req: Request): Promise<SuccessResponse<any>>;
    protected getCompanyNameDropDown(): Promise<SuccessResponse<any>>;
    protected updateRoMasterStatus(id: string, updateStatusRoMasterDto: UpdateStatusRoMasterDto): Promise<SuccessResponse<any>>;
}
