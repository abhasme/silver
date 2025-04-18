import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

export type SilverGroupDocument = SilverGroup & Document;

@Schema()
export class SilverGroup {

    @Prop({ type: String , required : true , trim: true, index: true, unique: true, sparse: true})
    group: string;

    @Prop({ type: Number , required : true , trim: true, index: true, unique: true, sparse: true})
    groupCode: number;

    @Prop({ type: Date,default: new Date() })
    createdAt: Date;

    @Prop({ type: Boolean , default: true })
    active: Boolean;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' , index: true})
    createdBy: Types.ObjectId;

}

export const SilverGroupSchema = SchemaFactory.createForClass(SilverGroup);

