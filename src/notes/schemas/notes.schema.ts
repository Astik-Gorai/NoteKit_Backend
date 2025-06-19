import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Mixed } from "mongoose";
import { NoteCommentSchema, NoteComment } from "./comment.schema";
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

    @Prop({required: true, unique: true})
    noteId: string
    
   @Prop({ type: [{ type: NoteCommentSchema }] })
  comments: NoteComment[];

  @Prop({default: 'Discover my latest note! Dive into my thoughts and join the conversation. 📝✨ #ShareYourStory'})
  caption: string;

    @Prop({ type: DataSchema })
data: any
}

export const NotesSchema = SchemaFactory.createForClass(Notes);


