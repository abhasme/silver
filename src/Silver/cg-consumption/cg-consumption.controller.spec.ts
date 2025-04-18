import { Test, TestingModule } from '@nestjs/testing';
import { CgConsumptionController } from './cg-consumption.controller';

describe('CgConsumptionController', () => {
  let controller: CgConsumptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CgConsumptionController],
    }).compile();

    controller = module.get<CgConsumptionController>(CgConsumptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
