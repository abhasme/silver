import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    itemCode: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    itemDescription: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    productName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    categoryid: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    subcategoryid: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    unitid: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    groupid: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    brandid: string;


    @ApiProperty()
    @IsNumber()
    @IsOptional()
    weight: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    LP: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    HP: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    KW: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    productStage: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    modelNo: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    suc_del: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    discount: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    finalPrice: string;

};
export class UpdateProductDto  {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    // @Transform(({ value }) => value?.trim())
    itemCode: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    // @Transform(({ value }) => value?.trim())
    itemDescription: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    // @Transform(({ value }) => value?.trim())
    productName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    // @Transform(({ value }) => value?.trim())
    categoryid: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    // @Transform(({ value }) => value?.trim())
    subcategoryid: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    // @Transform(({ value }) => value?.trim())
    unitid: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    // @Transform(({ value }) => value?.trim())
    groupid: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    // @Transform(({ value }) => value?.trim())
    brandid: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    LP: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    // @Transform(({ value }) => value?.trim())
    HP: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    // @Transform(({ value }) => value?.trim())
    KW: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    // @Transform(({ value }) => value?.trim())
    productStage: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    modelNo: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    suc_del: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    discount: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    finalPrice: string;

};

export class ImportProductDto {

    @ApiProperty()
    @IsString()
    @IsOptional()
    modelNo: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    itemCode: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    itemDescription: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    productName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    categoryName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    subcategoryName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    KW: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    HP: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    LP: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    suc_del: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    productStage: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    group: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    brand: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    unit: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    discount: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    finalPrice: string;



};

export class StatusProductDto {
    @ApiProperty()
    @IsString()
    productid: string;
  
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    active:Boolean;
};
