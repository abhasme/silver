import { PartialType, ApiProperty } from '@nestjs/swagger';
export class GetCgConsumptionInfoDto {
    @ApiProperty()
    protected readonly data: object;
    constructor(data) {
      return data;
    }
  }
  