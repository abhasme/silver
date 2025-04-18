import { UnitService } from '../../services/Silver/unit.service';
import { CreateUnitDto, UpdateUnitDto, FilterPaginationUnitDto, UpdateStatusUnitDto } from './dto/request-unit.dto';
import { GetUnitInfoDto } from './dto/response-unit.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { Request } from 'express';
import { SearchDto } from 'src/dto/pagination-dto';
export declare class UnitController {
    private readonly unitService;
    constructor(unitService: UnitService);
    protected createUnit(req: Request, createUnitDto: CreateUnitDto): Promise<any>;
    protected getAllUnits(req: Request, paginationDto: FilterPaginationUnitDto): Promise<SuccessResponse<any>>;
    protected getUnitInfo(id: string): Promise<SuccessResponse<GetUnitInfoDto>>;
    protected deleteUnit(id: string): Promise<import("../../entities/Silver/silverUnit.entity").SilverUnit>;
    protected UpdateUnit(id: string, updateUnitIdDto: UpdateUnitDto): Promise<SuccessResponse<any>>;
    protected getUnitDropDown(req: Request, searchDto: SearchDto): Promise<SuccessResponse<any>>;
    protected updateUnitStatus(id: string, updateUnitStatusDto: UpdateStatusUnitDto): Promise<SuccessResponse<any>>;
    protected test(): Promise<SuccessResponse<any>>;
}
