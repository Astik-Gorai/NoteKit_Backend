import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Schema()
export class Users extends Document{

    @Prop({required:true})
    name: string

    @Prop({required:true})
    email: string

    @Prop({required:true})
    password: string

    @Prop({unique: true, required: true})
    userId: string;

    @Prop({type: [String], default: []})
    friends: string[]

    // @Prop({type: [String], default: []})
    // friendRequests: string[]

    @Prop({type: [
        {
            from: {type: String, required: true},
            status:{
                type: String,
                enum: FriendRequestStatus,
                default: 'pending'
            }
        }
    ], default: []})
    friendRequests: [{
        from: string,
        status: FriendRequestStatus
    
    }]
    
}

export const UserSchema = SchemaFactory.createForClass(Users);