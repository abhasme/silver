import { PartialType, ApiProperty } from '@nestjs/swagger';
export class GetRoMasterInfoDto {
    @ApiProperty()
    protected readonly data: object;
    constructor(data) {
      return data;
    }
  }
  