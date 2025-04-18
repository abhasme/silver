

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber, IsArray,IsDate,IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types, ObjectId } from "mongoose";

export class CreateRoConsumptionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    roId:ObjectId;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    productId: ObjectId;

    @ApiProperty()
    @IsString()
    @IsOptional()
    itemId: ObjectId;

    @ApiProperty()
    @IsString()
    @IsOptional()
    inventoryid: ObjectId;

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

export class UpdateRoConsumptionDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    qty: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    roId:ObjectId;

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

export class ImportRoConsumptionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    roName:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    // @Transform(({value}) => new Date(value))
    date : Date

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    qty: number

    @ApiProperty()
    @IsString()
    @IsOptional()
    updatedInventory: string

};

export class paginationDto {
    
};


export class updateStatusRoConsumptionDto {
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    active:Boolean;
};


export class AddRoConsumptionDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    roId:string;
   
}