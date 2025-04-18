import { PartialType, ApiProperty } from '@nestjs/swagger';
export class GetAllRoInventoryDto {

}

export class GetRoInventoryInfoDto {
    @ApiProperty()
    protected readonly data: object;
    constructor(data) {
      return data;
    }
  }