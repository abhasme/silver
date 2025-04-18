import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber, IsMongoId, IsArray, ValidateNested, MinLength, MaxLength,IsBoolean} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Types, ObjectId } from "mongoose";
import { PaginationRequestDto } from './pagination-dto';

export class FilterPaginationSupplierPartnerDto extends PaginationRequestDto {
    @ApiProperty()
    @IsArray()
    @IsOptional()
    supplierName: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    contactPersonName: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    city: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    address: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    state: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    email: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    phone: [string];

    @ApiProperty()
    @IsArray()
    @IsOptional()
    leadTime: [number];

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isActive:Boolean; 
};