import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Permissionstatus } from '../../common/enums/role.enum';

export type RoInventoryDocument = RoInventory & Document;

@Schema()
export class RoInventory {

  @Prop({ type: SchemaTypes.ObjectId, ref: 'romasters' , index: true})
  roId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'siliverproduct' , index: true})
  productId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'roconsumptions' , index: true})
  consumptionId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'roorders' , index: true})
  orderId: Types.ObjectId;

  @Prop({ type: Number , index: true,default: 0})
  tog: number;


  @Prop({ type: Number , index: true,default: 0})
  rWC: number;

  @Prop({ type: Number , index: true,default: 0})
  leadTime: number;

  @Prop({ type: Number , index: true,default: 0})
  stockUpWeeks: number;


  @Prop({ type: String , index: true,default: 0})
  growthFactor: string;

  @Prop({ type: Boolean , default: false })
  isGrowthFactor: Boolean;


  @Prop({ type: Number , index: true,default: 0})
  onHandStock: number;

  @Prop({ type: Number , index: true,default: 0})
  openOrder: number;

  @Prop({ type: Number , index: true,default: 0})
  qualifiedDemand: number;

  @Prop({ type: Number , index: true,default: 0})
  netFlow: number;

  @Prop({ type: Number , index: true,default: 0})
  orderRecommendation: number;

  @Prop({ type: String})
  orderRecommendationStatus: string;

  @Prop({ type: String})
  onHandStatus: string;

  @Prop({ type: Number , index: true,default: 0})
  moq: number;

  @Prop({ required: true, enum: Permissionstatus, default: "BLACK"  }) // Use the enum for the field
  flag: Permissionstatus;

  @Prop({ type: Number , index: true,default: 0})
  consumption: number;
 
  @Prop({ type: Date,default: new Date() })
  createdAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' , index: true})
  createdBy: Types.ObjectId;

  @Prop({ type: Boolean , default: true })
  active: Boolean;

  @Prop({ type: Boolean , default: false })
  isUpdateInventory: Boolean;

  @Prop({ type: Boolean , default: false })
  isUpdateTog: Boolean;

  // Silver

  //Last year same month  QTY
  @Prop({ type: Number , index: true,default: 0})
  LYM: number;

  //Current year Monthly avg QTY
  @Prop({ type: Number , index: true,default: 0})
  CYM: number;

 //Last 3 months moving AVG
  @Prop({ type: Number , index: true,default: 0})
  L13: number;

  //Lead Time Buffer
  @Prop({ type: Number , index: true,default: 0})
  LBS: number;

  //Stock up Weeks Buffer
  @Prop({ type: Number , index: true,default: 0})
  SWB: number;

  @Prop({ type: Number , index: true,default: 0})
  togRecommendation: number;

  @Prop({ type: Number , index: true,default: 0})
  finalTog: number;

  @Prop({ type: Number , index: true,default: 0})
  oldTog: number;

  @Prop({ type: Boolean , default: false })
  isConvertFinalToTog: Boolean;

}

export const RoInventorySchema = SchemaFactory.createForClass(RoInventory);