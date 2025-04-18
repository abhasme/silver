import { PaginationRequestDto } from 'src/dto/pagination-dto';
export declare class CreateUnitDto {
    unit: string;
    unitCode: number;
}
export declare class UpdateUnitDto extends CreateUnitDto {
}
export declare class FilterPaginationUnitDto extends PaginationRequestDto {
    active: Boolean;
}
export declare class UpdateStatusUnitDto {
    active: Boolean;
}
