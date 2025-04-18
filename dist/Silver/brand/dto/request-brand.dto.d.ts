import { PaginationRequestDto } from 'src/dto/pagination-dto';
export declare class CreateBrandDto {
    brand: string;
    brandCode: number;
}
export declare class UpdateBrandDto extends CreateBrandDto {
}
export declare class FilterPaginationBrandDto extends PaginationRequestDto {
    active: Boolean;
}
export declare class UpdateStatusBrandDto {
    active: Boolean;
}
