import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

export type SilverProductDocument = SilverProduct & Document;

@Schema()
export class SilverProduct {

    @Prop({ type: String , required : true , trim: true, index: true, unique: true, sparse: true})
    itemCode: string;

    @Prop({ type: String })
    itemDescription: string;

    @Prop({ type: String , index: true})
    productName: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'SilverCategory' , index: true})
    categoryid: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'SilverSubcategory' , index: true})
    subcategoryid: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, required: false,  ref: 'Unit' , index: true,default: ""})
    unitid: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId,  required: false, ref: 'Brand' , index: true,default: ""})
    brandid: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, required: false,  ref: 'Group' , index: true,default: ""})
    groupid: Types.ObjectId;
  
    @Prop({ type: Number , index: true,default: 0})
    LP: string;

    @Prop({ type: String , index: true})
    HP: string;

    @Prop({ type: String , index: true})
    KW: string;

    @Prop({ type: String , index: true})
    productStage: string;

    @Prop({ type: String , index: true})
    modelNo: String;

    @Prop({ type: String , index: true})
    suc_del: number;

    @Prop({ type: String , index: true})
    discount: String;

    @Prop({ type: String , index: true})
    finalPrice: String;

    @Prop({ type: Date,default: new Date() })
    createdAt: Date;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' , index: true})
    createdBy: Types.ObjectId;

    @Prop({ type: Boolean , default: true })
    active: Boolean;
};

export const SilverProductSchema = SchemaFactory.createForClass(SilverProduct);
