import { Test, TestingModule } from '@nestjs/testing';
import { SilverCategoryController } from './silver-category.controller';

describe('SilverCategoryController', () => {
  let controller: SilverCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SilverCategoryController],
    }).compile();

    controller = module.get<SilverCategoryController>(SilverCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
