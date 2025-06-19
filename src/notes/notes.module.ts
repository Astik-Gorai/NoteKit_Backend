import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notes, NotesSchema } from './schemas/notes.schema';
import { AuthMiddleware } from '../auth/auth.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Users, UserSchema } from 'src/auth/schemas/user.schema';

@Module({

  imports:[MongooseModule.forFeature([{name: Users.name, schema:UserSchema}]),
    MongooseModule.forFeature(
    [{
        name: Notes.name,
        schema: NotesSchema
    }]
  ),
  JwtModule
],    
  controllers: [NotesController],
  providers: [NotesService]
})
export class NotesModule implements NestModule {

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(NotesController)
    }
}
