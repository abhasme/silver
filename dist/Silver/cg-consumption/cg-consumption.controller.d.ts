import { CgConsumptionService } from '../../services/Silver/cg-consumption.service';
import { SuccessResponse } from '../../common/interfaces/response';
import { CreateCgConsumptionDto, ImportCgConsumptionDto, UpdateCgConsumptionDto, updateStatusCgConsumptionDto } from './dto/request-cgConsumption.dto';
import { Request } from 'express';
import { FilterPaginationCgConsumptionDto } from 'src/dto/cg-consumption.dto';
export declare class CgConsumptionController {
    private readonly cgConsumptionService;
    constructor(cgConsumptionService: CgConsumptionService);
    protected createChannelPartner(req: Request, createConsumptionDto: CreateCgConsumptionDto): Promise<any>;
    protected getAllConsumption(req: Request, paginationDto: FilterPaginationCgConsumptionDto): Promise<SuccessResponse<any>>;
    protected getConsumptionInfo(id: string): Promise<SuccessResponse<any>>;
    protected UpdateConsumption(req: Request, updateCgConsumptionDto: UpdateCgConsumptionDto): Promise<SuccessResponse<any>>;
    importConsumption(req: Request, importCgConsumptionDto: ImportCgConsumptionDto[]): Promise<SuccessResponse<any>>;
    protected updateConsumptionStatus(id: string, updateConsumptionStatusDto: updateStatusCgConsumptionDto): Promise<SuccessResponse<any>>;
    protected getConsumptionDropDown(req: Request): Promise<SuccessResponse<any>>;
    protected getCgInventoryList(req: Request): Promise<SuccessResponse<any>>;
}
