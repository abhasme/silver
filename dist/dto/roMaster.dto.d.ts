import { PaginationRequestDto } from './pagination-dto';
export declare class FilterPaginationRoMasterDto extends PaginationRequestDto {
    roName: [string];
    contactPersonName: [string];
    city: [string];
    address: [string];
    state: [string];
    email: [string];
    phone: [string];
    growthFactor: [string];
    stockUpWeeks: [number];
    leadTime: [number];
    isActive: Boolean;
    sortBy?: {
        orderKey?: string;
        orderValue?: number;
    }[];
}
