import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { BlacklistToken } from './schemas/blacklist-token.schema';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<Users>,
    private readonly jwtService: JwtService,
    @InjectModel(BlacklistToken.name)
    private blacklistTokenModel: Model<BlacklistToken>,
  ) {}

  async signUp(body: SignUpDto): Promise<{ token: string }> {
    try {
      const { email, name, password } = body;
      if (!email || !name || !password) {
        throw new HttpException('Missing fields', HttpStatus.BAD_REQUEST);
      }

      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      // Generate Unique User Id 
      let isUnique = false;
      let userId= '';
      while(!isUnique){
        userId = nanoid(10)
        const existingUser = await this.userModel.findOne({userId});
        if(!existingUser)
          isUnique = true;
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const newUser = new this.userModel({ ...body, password: hashedPassword , userId});
      await newUser.save();

      const payload = { username: newUser.email, userId ,name: newUser.name};
      const token = this.jwtService.sign(payload);

      return { token };
    } catch (error) {
      console.error('Signup error:', error);
      throw new HttpException(
        'Signup failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(userData: LoginDto): Promise<any> {
    const existingUser = await this.userModel.findOne({
      email: userData.email,
    });
    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { username: existingUser.email, userId: existingUser.userId , name: existingUser.name};
    return { token: this.jwtService.sign(payload) };
  }

  async resetPassword(userData: any): Promise<any> {
    const existingUser = await this.userModel.findOne({
      email: userData?.email,
    });

    if (!existingUser) {
      throw new HttpException(
        'No User Exist in this email',
        HttpStatus.NOT_FOUND,
      );
    }

    const isSamePassword = await bcrypt.compare(
      userData.newPassword,
      existingUser.password,
    );
    if (isSamePassword) {
      throw new HttpException('Same Password', HttpStatus.NOT_ACCEPTABLE);
    }

    const hashedPassword = await bcrypt.hash(userData.newPassword, SALT_ROUNDS);
    existingUser.password = hashedPassword;
    await existingUser.save();

    const payload = { username: userData.email };
    return { token: this.jwtService.sign(payload) };
  }

  async logout(data): Promise<any> {
    try {
      const newBlacklistedToken = new this.blacklistTokenModel({
        token: data.token,
      });
      await newBlacklistedToken.save();
      return HttpStatus.ACCEPTED;
    } catch (err) {
      throw err;
    }
  }
}
