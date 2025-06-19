import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from 'src/auth/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name: Users.name, schema:UserSchema}]),
    ],
  providers: [ProfileService],
  controllers: [ProfileController]
})
export class ProfileModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(ProfileController)
    }
}
