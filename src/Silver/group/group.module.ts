import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose'
import { GroupService } from '../../services/Silver/group.service';
import { SilverGroup, SilverGroupSchema } from '../../entities/Silver/silverGroup.entity';
import { SilverProduct, SilverProductSchema } from '../../entities/Silver/silverProductMaster';
import { User, UserSchema } from '../../entities/users.entity';
import { LoginMiddleware } from 'src/common/middleware/login.middleware';


@Module({
  imports: [MongooseModule.forFeature([
    { name: SilverGroup.name, schema: SilverGroupSchema },
    { name: SilverProduct.name, schema: SilverProductSchema },
    { name: User.name, schema: UserSchema },
  ])],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes(GroupController)
  }
}