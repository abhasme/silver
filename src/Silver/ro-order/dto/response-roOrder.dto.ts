import { PartialType, ApiProperty } from '@nestjs/swagger';
export class GetRoOrderInfoDto {
    @ApiProperty()
    protected readonly data: object;
    constructor(data) {
      return data;
    }
  };
  
  export class GetAllRoOrderDto {

  }