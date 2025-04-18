export declare class CreateProductDto {
    itemCode: string;
    itemDescription: string;
    productName: string;
    categoryid: string;
    subcategoryid: string;
    unitid: string;
    groupid: string;
    brandid: string;
    weight: number;
    LP: string;
    HP: string;
    KW: string;
    productStage: string;
    modelNo: string;
    suc_del: string;
    discount: string;
    finalPrice: string;
}
export declare class UpdateProductDto {
    itemCode: string;
    itemDescription: string;
    productName: string;
    categoryid: string;
    subcategoryid: string;
    unitid: string;
    groupid: string;
    brandid: string;
    LP: string;
    HP: string;
    KW: string;
    productStage: string;
    modelNo: string;
    suc_del: string;
    discount: string;
    finalPrice: string;
}
export declare class ImportProductDto {
    modelNo: string;
    itemCode: string;
    itemDescription: string;
    productName: string;
    categoryName: string;
    subcategoryName: string;
    KW: string;
    HP: string;
    LP: string;
    suc_del: string;
    productStage: string;
    group: string;
    brand: string;
    unit: string;
    discount: string;
    finalPrice: string;
}
export declare class StatusProductDto {
    productid: string;
    active: Boolean;
}
