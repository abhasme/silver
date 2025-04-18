import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

export type RoConsumptionDocument = RoConsumption & Document;

@Schema()
export class RoConsumption {

  @Prop({ type: SchemaTypes.ObjectId, ref: 'RoMaster' , index: true})
  roId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'SilverProduct' , index: true})
  productId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'RoInventory' , index: true})
  inventoryId: Types.ObjectId;

  @Prop({ type: Number , index: true,default: 0})
  qty: number;

  @Prop({ type: Date,default: new Date() })
  date: Date;

  @Prop({ type: Date,default: new Date() })
  createdAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' , index: true})
  createdBy: Types.ObjectId;

  @Prop({ type: Boolean , default: true })
  active: Boolean;
}

export const RoConsumptionSchema = SchemaFactory.createForClass(RoConsumption);