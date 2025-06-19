import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesModule } from './notes/notes.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [AuthModule,
    MongooseModule.forRoot('mongodb+srv://astik:123@primarydb.8finuah.mongodb.net/?retryWrites=true&w=majority&appName=PrimaryDB'),
    // MongooseModule.forRoot('mongodb://localhost:27017/NoteKit'),
    NotesModule,
    JwtModule.register({
      global: true, 
      secret: 'jwtSecret',
      signOptions: { expiresIn: '1h' },
    }),
    ProfileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
