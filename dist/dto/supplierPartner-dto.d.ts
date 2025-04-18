import { PaginationRequestDto } from './pagination-dto';
export declare class FilterPaginationSupplierPartnerDto extends PaginationRequestDto {
    supplierName: [string];
    contactPersonName: [string];
    city: [string];
    address: [string];
    state: [string];
    email: [string];
    phone: [string];
    leadTime: [number];
    isActive: Boolean;
}
