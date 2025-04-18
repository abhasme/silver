import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

export type CgConsumptionDocument = CgConsumption & Document;

@Schema()
export class CgConsumption {

  @Prop({ type: SchemaTypes.ObjectId, ref: 'silverproductId' , index: true})
  productId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'cgInventorys' , index: true})
  inventoryId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'romasters' , index: true})
  roId: Types.ObjectId;

  @Prop({ type: Number , index: true,default: 0})
  qty: number;

  @Prop({ type: String,index: true, default: ""})
  opNumber: string;

  @Prop({ type: Date,default: new Date() })
  date: Date;

  @Prop({ type: Date,default: new Date() })
  createdAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' , index: true})
  createdBy: Types.ObjectId;

  @Prop({ type: Boolean , default: true })
  active: Boolean;
}

export const CgConsumptionSchema = SchemaFactory.createForClass(CgConsumption);