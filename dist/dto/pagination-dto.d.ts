export declare class PaginationRequestDto {
    currentPage: number;
    recordPerPage: number;
    totalDocs: number;
    totalPages: number;
    search: string;
    orderBy: [string];
}
export declare class SearchRequestDto {
    search: string;
    startDate: string;
    endDate: string;
    productid: string;
}
export declare class SearchDto {
    search: string;
    startDate: string;
    endDate: string;
    productid: string;
    channelPartnerId: string;
    supplierPartnerId: string;
}
