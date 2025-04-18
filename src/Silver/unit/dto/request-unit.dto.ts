import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsNumber,IsBoolean} from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationRequestDto } from 'src/dto/pagination-dto';
import { StepTimeline } from 'aws-sdk/clients/emr';
export class CreateUnitDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  unitCode: number;
};

export class UpdateUnitDto extends CreateUnitDto {

};

export class FilterPaginationUnitDto extends PaginationRequestDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active:Boolean;
};

export class UpdateStatusUnitDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  active:Boolean;
}