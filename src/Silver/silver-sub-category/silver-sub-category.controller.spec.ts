import { Test, TestingModule } from '@nestjs/testing';
import { SilverSubCategoryController } from './silver-sub-category.controller';

describe('SilverSubCategoryController', () => {
  let controller: SilverSubCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SilverSubCategoryController],
    }).compile();

    controller = module.get<SilverSubCategoryController>(SilverSubCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
