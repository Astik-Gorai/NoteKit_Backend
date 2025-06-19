import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {

    constructor(private profileService: ProfileService){

    }

    @Get('/details')
    getMyDetails(@Req() req: Request){
        // console.log('Request at controller: ', req);
        return this.profileService.getMyProfile(req);
    }

    @Get('/my-friends')
    getMyFriend(@Req() req: Request){
        return this.profileService.getMyFriends(req);
    }

    @Post('/send-request')
    sendFriendRequest(@Req() req: Request, @Body() userData){
        console.log('Friend Id', userData)
        return this.profileService.sendRequest(req,userData.friendId);
    }

    @Post('/accept-request')
    acceptRequest(@Req() req: Request, @Body() userData){
        return this.profileService.approveRequest(req,userData.friendId);
    }

    @Post('/reject-request')
    rejectRequest(@Req() req: Request, @Body() userData){
        return this.profileService.rejectRequest(req,userData.friendId);
    }

    @Get('/pending-requests')
    showPendingFriendRequests(@Req() req: Request){
        return this.profileService.getPendingRequests(req);
    }

    @Get('/get-users')
    getUsers(@Query('userData') userData: string){
        return this.profileService.getUserByEmailOrName(userData);
    }

    @Get('hi')
    sayHello(){
        return 'hiiiii'
    }
}
