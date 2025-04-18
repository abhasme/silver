import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

export type SilverBrandDocument = SilverBrand & Document;

@Schema()
export class SilverBrand {

    @Prop({ type: String , required : true , trim: true, index: true, unique: true, sparse: true})
    brand: string;

    @Prop({ type: Number , required : true , trim: true, index: true, unique: true, sparse: true})
    brandCode: number;

    @Prop({ type: Date,default: new Date() })
    createdAt: Date;

    @Prop({ type: Boolean , default: true })
    active: Boolean;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' , index: true})
    createdBy: Types.ObjectId;

}

export const SilverBrandSchema = SchemaFactory.createForClass(SilverBrand);

