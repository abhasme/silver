import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { MongooseModule } from '@nestjs/mongoose'
import { BrandService } from '../../services/Silver/brand.service';
import { SilverBrand, SilverBrandSchema } from '../../entities/Silver/silverBrand.entity';
import { SilverProduct, SilverProductSchema } from '../../entities/Silver/silverProductMaster';
import { User, UserSchema } from '../../entities/users.entity';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';


@Module({
  imports: [MongooseModule.forFeature([
    { name: SilverBrand.name, schema: SilverBrandSchema },
    { name: SilverProduct.name, schema: SilverProductSchema },
    { name: User.name, schema: UserSchema },
  ])],
  controllers: [BrandController],
  providers: [BrandService]
})
export class BrandModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(LoginMiddleware)
    .forRoutes(BrandController)
  }
}