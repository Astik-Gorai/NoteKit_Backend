import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { Users } from './schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
   constructor(private authService: AuthService){

   } 

   @Post('signup')
   signUp(@Req() req: Request, @Body() body: SignUpDto): Promise<any>{
    return this.authService.signUp(body);
   }
   
   @Post('login')
   login(@Body() userData: LoginDto): Promise<any>{
      return this.authService.login(userData);
   }

   @Get()
   getProfile(@Req() req: Request){

   }

   @Get('reset-password')
   resetPassword(@Body() userData): Promise<any>{
      return this.authService.resetPassword(userData);
   }
   @Post('logout')
   logOut(@Body() userData: any){
      return this.authService.logout(userData);
   }
}
