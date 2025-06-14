import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
class Comment {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  message: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);