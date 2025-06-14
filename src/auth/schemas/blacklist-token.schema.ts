import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class BlacklistToken{
    @Prop({required:true})
    token: string

    @Prop({default: Date.now, expires: 60*60} )
    createdAt: Date
}

export const BlacklistTokenSchema = SchemaFactory.createForClass(BlacklistToken);