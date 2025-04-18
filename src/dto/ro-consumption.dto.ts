
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber, IsMongoId, IsArray, ValidateNested, MinLength, MaxLength, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Types, ObjectId } from "mongoose";

import { PaginationRequestDto } from './pagination-dto';

export class FilterPaginationRoConsumptionDto extends PaginationRequestDto {
    @ApiProperty()
    @IsArray()
    @IsOptional()
    qty: [number];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    itemDescription: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    productName: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    subCategoryName: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    categoryName: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    itemCode: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    roName: [string];

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.toString())
    roId: string;


    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active: Boolean;


    @ApiProperty()
    @IsOptional()
    createdAt: [string]

    @ApiProperty()
    @IsOptional()
    date: [string]

    @ApiProperty()
    @IsArray()
    @IsOptional()
    openOrder: [number];

    @ApiProperty()
    @IsOptional()
    qualifiedDemand: [number]

    @ApiProperty()
    @IsOptional()
    unit: [number]

    @ApiProperty({ required: false })
    @IsOptional()
    dateRange?: {
      from?: string;
      to?: string;
    }[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    sortBy?: {
      orderKey?: string;
      orderValue?: number;
    }[];

};