import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

export type SilverUnitDocument = SilverUnit & Document;

@Schema()
export class SilverUnit {

    @Prop({ type: String , required : true , trim: true, index: true, unique: true, sparse: true})
    unit: string;

    @Prop({ type: Number , required : true , trim: true, index: true, unique: true, sparse: true})
    unitCode: number;

    @Prop({ type: Date,default: new Date() })
    createdAt: Date;

    @Prop({ type: Boolean , default: true })
    active: Boolean;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' , index: true})
    createdBy: Types.ObjectId;

}

export const SilverUnitSchema = SchemaFactory.createForClass(SilverUnit);

