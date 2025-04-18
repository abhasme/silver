import { RoConsumptionService } from '../../services/Silver/ro-consumption.service';
import { SuccessResponse } from '../../common/interfaces/response';
import { AddRoConsumptionDto, CreateRoConsumptionDto, ImportRoConsumptionDto, UpdateRoConsumptionDto, updateStatusRoConsumptionDto } from './dto/request-roConsumption.dto';
import { Request } from 'express';
import { FilterPaginationRoConsumptionDto } from 'src/dto/ro-consumption.dto';
export declare class RoConsumptionController {
    private readonly roConsumptionService;
    constructor(roConsumptionService: RoConsumptionService);
    protected createChannelPartner(req: Request, createConsumptionDto: CreateRoConsumptionDto): Promise<any>;
    protected getAllConsumption(req: Request, paginationDto: FilterPaginationRoConsumptionDto): Promise<SuccessResponse<any>>;
    protected getConsumptionInfo(id: string): Promise<SuccessResponse<any>>;
    protected UpdateConsumption(req: Request, updateConsumptionDto: UpdateRoConsumptionDto): Promise<SuccessResponse<any>>;
    importConsumption(req: Request, createConsumptionDto: ImportRoConsumptionDto[]): Promise<SuccessResponse<any>>;
    protected updateConsumptionStatus(id: string, updateConsumptionStatusDto: updateStatusRoConsumptionDto): Promise<SuccessResponse<any>>;
    protected getConsumptionDropDown(req: Request): Promise<SuccessResponse<any>>;
    protected getRoInventoryList(req: Request, addRoConsumptionDto: AddRoConsumptionDto): Promise<SuccessResponse<any>>;
}
