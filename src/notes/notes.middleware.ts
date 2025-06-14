import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: any;
}

@Injectable()
export class NotesMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {

    console.log('JwtService injected:', !!this.jwtService);
  } 
  use(req: CustomRequest, res: Response, next: NextFunction) {
    
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Invalid or missing Bearer token');
  }
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token)
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }
    try {
      const decoded = this.jwtService.verify(token);
      console.log('Decoded JWT:', decoded); // Debug
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}