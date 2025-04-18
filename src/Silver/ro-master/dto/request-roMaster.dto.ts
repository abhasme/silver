

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty,IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';


export class CreateRoMasterDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    roName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    contactPersonName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    phone: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    address: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    city: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    state: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    leadTime: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    stockUpWeeks: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()

    growthFactor: string;


};

export class UpdateRoMasterDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    roName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    contactPersonName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    phone: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    address: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    city: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    state: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    leadTime: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    stockUpWeeks: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    growthFactor: string;


};

export class ImportRoMasterDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    roName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    contactPersonName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    phone: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    address: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    city: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    state: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    leadTime: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    stockUpWeeks: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()

    growthFactor: string;

  
};

export class paginationDto {
    
};

export class UpdateStatusRoMasterDto {
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    active:Boolean;
};