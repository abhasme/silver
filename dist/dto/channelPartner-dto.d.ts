import { PaginationRequestDto } from './pagination-dto';
export declare class FilterPaginationChannelPartnerDto extends PaginationRequestDto {
    companyName: [string];
    contactPersonName: [string];
    city: [string];
    address: [string];
    state: [string];
    email: [string];
    phone: [string];
    leadTime: [number];
    isActive: Boolean;
}
