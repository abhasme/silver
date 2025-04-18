import { Test, TestingModule } from '@nestjs/testing';
import { RoOrderController } from './ro-order.controller';

describe('RoOrderController', () => {
  let controller: RoOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoOrderController],
    }).compile();

    controller = module.get<RoOrderController>(RoOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
