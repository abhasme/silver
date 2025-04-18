import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SilverSubcategoryService } from '../../services/Silver/sub-category.service';
import { SilverSubCategoryController } from '../silver-sub-category/silver-sub-category.controller';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';
import { SilverSubcategory, SilverSubcategorySchema } from '../../entities/Silver/silverSubCategory';
import { SilverCategory, SilverCategorySchema } from '../../entities/Silver/silverCategory.entity';
import { SilverProduct, SilverProductSchema } from '../../entities/Silver/silverProductMaster';
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [ MongooseModule.forFeature([
    { name: SilverSubcategory.name, schema: SilverSubcategorySchema },
    { name: SilverCategory.name, schema: SilverCategorySchema },
    { name: SilverProduct.name, schema: SilverProductSchema }])],
  controllers: [SilverSubCategoryController],
  providers: [SilverSubcategoryService]
})
export class SilverSubCategoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes(SilverSubCategoryController)
  }
}