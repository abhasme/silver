import { Test, TestingModule } from '@nestjs/testing';
import { CgOrderController } from './cg-order.controller';

describe('CgOrderController', () => {
  let controller: CgOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CgOrderController],
    }).compile();

    controller = module.get<CgOrderController>(CgOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
