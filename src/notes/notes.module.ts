import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notes, NotesSchema } from './schemas/notes.schema';
import { NotesMiddleware } from './notes.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({

  imports:[MongooseModule.forFeature(
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
        consumer.apply(NotesMiddleware).forRoutes(NotesController)
    }
}
