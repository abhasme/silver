import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Request } from 'express';
import { SilverUnit, SilverUnitDocument } from '../../entities/Silver/silverUnit.entity';
import { UserDocument } from '../../entities/users.entity';
import { SilverProductDocument } from '../../entities/Silver/silverProductMaster';
import { SearchDto } from 'src/dto/pagination-dto';
import { GetUnitInfoDto } from '../../Silver/unit/dto/response-unit.dto';
import { CreateUnitDto, FilterPaginationUnitDto, UpdateStatusUnitDto, UpdateUnitDto } from '../../Silver/unit/dto/request-unit.dto';
export declare class UnitService {
    private unitModel;
    private userModel;
    private productModel;
    constructor(unitModel: Model<SilverUnitDocument>, userModel: Model<UserDocument>, productModel: Model<SilverProductDocument>);
    createUnit(createUnitDto: CreateUnitDto, req: Request): Promise<BadRequestException | GetUnitInfoDto>;
    getAllUnits(paginationDto: FilterPaginationUnitDto, req: Request): Promise<any>;
    getUnitInfo(id: string): Promise<any>;
    deleteUnit(id: string): Promise<SilverUnit>;
    UpdateUnit(id: string, updateUnitDto: UpdateUnitDto): Promise<SilverUnit>;
    getUnitDropDown(searchDto: SearchDto, req: Request): Promise<any>;
    updateUnitStatus(id: string, updateStatusUnitDto: UpdateStatusUnitDto): Promise<SilverUnit>;
    test(): Promise<any>;
}
