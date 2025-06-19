import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { emit } from 'process';
import { FriendRequestStatus, Users } from 'src/auth/schemas/user.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  async getMyProfile(req: any) {
    const user = await this.userModel.find({ email: req.email });
    if (!user) {
      throw new HttpException('No Notes found', HttpStatus.NOT_FOUND);
    }
    // console.log('Request', req)
    console.log('Found User', user)
    return user;
  }

  async getMyFriends(req: any) {
    const user = await this.userModel.findOne({ userId: req.userId });
    if (!user) return [];

    const friends = await this.userModel.find(
      { userId: { $in: user.friends } },
      'userId name email',
    );

    return friends;
  }

  async getPendingRequests(req: any) {
  try {
    const user = await this.userModel.findOne({ userId: req.userId });
    const pendingRequests = [];
// For Each Loop Here Create a problem it does not handel asynchcrous operation properly
    for (const userReq of user.friendRequests) {
      const requesterId = userReq.from;
      console.log(`friend id, ${requesterId}`);
      const requester = await this.userModel.findOne({ userId: requesterId });
      if (userReq.status === FriendRequestStatus.PENDING) {
        pendingRequests.push({
          userId: requester.userId,
          email: requester.email,
          name: requester.name
        });
      }
    }

    return pendingRequests;
  } catch (error) {
    throw error;
  }
}

  async sendRequest(req: any, friendId: string) {
    try {
      const currentUser = await this.userModel.findOne({ userId: req.userId });
      const friend = await this.userModel.findOne({ userId: friendId });
      if (!friend) {
        throw new HttpException(
          'No UserFOund for this Id',
          HttpStatus.FAILED_DEPENDENCY,
        );
      }else{
        console.log('got one friend', friend)
      }
      if(currentUser){
        console.log('got current user',currentUser)
      }else{
        console.log('No current USer')
      }
      friend.friendRequests.push({
        from: currentUser.userId,
        status: FriendRequestStatus.PENDING,
      });
      await friend.save()
      
      return { status: HttpStatus.ACCEPTED, message: 'Friend request sent' };
    } catch (err) {
      throw err;
    }
  }
  async approveRequest(req: any, friendId: string) {
    try {
      const currentUser = await this.userModel.findOne({ userId: req.userId });
      const friend = await this.userModel.findOne({userId: friendId});
      currentUser.friends.forEach((id) => {
        if (friendId == id)
          throw new HttpException(
            'User already exists in friend list',
            HttpStatus.CONFLICT,
          );
      });
      currentUser.friends.push(friendId);
      currentUser.friendRequests.forEach((req) => {
        if (req.from == friendId) req.status = FriendRequestStatus.ACCEPTED;
      });
      friend.friends.push(currentUser.userId)
      await currentUser.save();
      await friend.save();
    } catch (err) {
      throw err;
    }
  }
  async rejectRequest(req: any, friendId: string) {
    try {
      const currentUser = await this.userModel.findOne({ userId: req.userId });
      currentUser.friendRequests.forEach((userReq) => {
        if (
          userReq.status == FriendRequestStatus.PENDING &&
          userReq.from == friendId
        ) {
          userReq.status = FriendRequestStatus.REJECTED;
        }
      });
      await currentUser.save();
    } catch (error) {
      throw error;
    }
  }
  async getUserByEmailOrName(data: string){
    if (!data || typeof data !== 'string') {
  throw new BadRequestException('Search term must be a string');
}
console.log(data);
    const modifiedData = data.trim();
    try{
      let userWithEmail = [];
       userWithEmail = await this.userModel.find({email: modifiedData});
      if(userWithEmail.length!=0)
          return userWithEmail;
      const usersWithName = await this.userModel.find({name: modifiedData})
      if(usersWithName)
        return usersWithName;
       throw new NotFoundException('No Users Found')
    }catch(err){
    console.error(err)
  }
  }
}
