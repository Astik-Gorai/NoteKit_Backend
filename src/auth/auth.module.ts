import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from './schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { BlacklistToken, BlacklistTokenSchema } from './schemas/blacklist-token.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: Users.name, schema:UserSchema}]),
    MongooseModule.forFeature([{name: BlacklistToken.name, schema: BlacklistTokenSchema}])
],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {
  
}
