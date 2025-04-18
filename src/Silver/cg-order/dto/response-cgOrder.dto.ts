import { PartialType, ApiProperty } from '@nestjs/swagger';
export class GetCgOrderInfoDto {
    @ApiProperty()
    protected readonly data: object;
    constructor(data) {
      return data;
    }
  };
  
  export class GetAllCgOrderDto {

  }