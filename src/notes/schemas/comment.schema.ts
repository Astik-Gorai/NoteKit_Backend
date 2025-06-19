import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class NoteComment {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  message: string;
}

export const NoteCommentSchema = SchemaFactory.createForClass(NoteComment);