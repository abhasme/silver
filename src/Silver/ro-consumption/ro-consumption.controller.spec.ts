import { Test, TestingModule } from '@nestjs/testing';
import { RoConsumptionController } from './ro-consumption.controller';

describe('RoConsumptionController', () => {
  let controller: RoConsumptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoConsumptionController],
    }).compile();

    controller = module.get<RoConsumptionController>(RoConsumptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
