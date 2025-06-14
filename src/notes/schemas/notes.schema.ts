import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Mixed } from "mongoose";
import { CommentSchema } from "./comment.schema";
import { DataSchema } from "./data.schema";


@Schema({ timestamps: true })
export class Notes{

    @Prop({required:true})
    title: string

    @Prop({default: 0})
    likes: number

    @Prop({default:false})
    isShared: boolean

    @Prop({required: true})
    owner: string
    
   @Prop({ type: [{ type: CommentSchema }] })
  comments: Comment[];

    @Prop({ type: DataSchema })
data: any
}

export const NotesSchema = SchemaFactory.createForClass(Notes);


