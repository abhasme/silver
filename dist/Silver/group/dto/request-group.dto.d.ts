import { PaginationRequestDto } from 'src/dto/pagination-dto';
export declare class CreateGroupDto {
    group: string;
    groupCode: number;
}
export declare class UpdateGroupDto extends CreateGroupDto {
}
export declare class FilterPaginationGroupDto extends PaginationRequestDto {
    active: Boolean;
}
export declare class UpdateStatusGroupDto {
    active: Boolean;
}
