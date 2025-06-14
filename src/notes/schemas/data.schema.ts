import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";



@Schema()
class Data{
    @Prop()
    time: number

    @Prop()
    blocks: Array<any>
    
    @Prop()
    version: string
}

export const DataSchema = SchemaFactory.createForClass(Data);
