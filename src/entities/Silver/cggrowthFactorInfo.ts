import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';


export type CgGrowthFactorDocument = CgGrowthFactor & Document;

@Schema()
export class CgGrowthFactor {

    @Prop({ type: SchemaTypes.ObjectId, ref: 'cginventories' , index: true})
    cgInventoryId: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'roinventories' , index: true})
    roInventoryId: Types.ObjectId;

    @Prop({ type: Boolean , default: true })
    isUpdateGrowthFactor: Boolean;

    @Prop({ type: Number, index: true, default:1})
    orderNumber: number;
  

    @Prop({ type: Date,default: new Date() })
    createdAt: Date;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' , index: true})
    createdBy: Types.ObjectId;

   
}

export const CgGrowthFactorSchema = SchemaFactory.createForClass(CgGrowthFactor);