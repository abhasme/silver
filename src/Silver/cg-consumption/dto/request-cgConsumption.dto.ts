

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber,IsDate,IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types, ObjectId } from "mongoose";

export class CreateCgConsumptionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    productId: ObjectId;

    @ApiProperty()
    @IsString()
    @IsOptional()
    inventoryId: ObjectId;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Transform(({value}) => new Date(value))
    date : Date | string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    qty: number

};

export class UpdateCgConsumptionDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    qty: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productId: ObjectId;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    consumptionId: ObjectId;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Transform(({value}) => new Date(value))
    date : Date | string;

};

export class ImportCgConsumptionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productName: string;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Transform(({value}) => new Date(value))
    date : Date | string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    qty: number

};

export class paginationDto {
    
};


export class updateStatusCgConsumptionDto {
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    active:Boolean;
}