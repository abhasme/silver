import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Permissionstatus } from '../../common/enums/role.enum';

export type CgInventoryDocument = CgInventory & Document;

@Schema()
export class CgInventory {

  @Prop({ type: SchemaTypes.ObjectId, ref: 'siliverproduct' , index: true})
  productId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'roinventories' , index: true})
  roInventoryId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'cgconsumptions' , index: true})
  consumptionId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'cgorders' , index: true})
  orderId: Types.ObjectId;

  @Prop({ type: Number , index: true,default: 0})
  tog: number;

  @Prop({ type: Number , index: true,default: 0})
  avgWeeklyConsumption: number;

  @Prop({ type: Number , index: true,default: 0})
  roSigma: number;

  @Prop({ type: Number , index: true,default: 0})
  plantLeadTime: number;


  @Prop({ type: Number , index: true,default: 0})
  togRecommendation: number;

  @Prop({ type: Number , index: true,default: 0})
  oldTogRecommendation: number;

  @Prop({ type: String , index: true,default: 0})
  growthFactor: string;

  @Prop({ type: Boolean , default: false })
  isGrowthFactor: Boolean;

  @Prop({ type: Boolean , default: false })
  isConvertFinalToTog: Boolean;

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

  @Prop({ type: Number , index: true,default: 0})
  moq: number;

  @Prop({ type: String})
  orderRecommendationStatus: string;

  @Prop({ type: String})
  onHandStatus: string;

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

  @Prop({ type: Boolean , default: true })
  isUpdateInventory: Boolean;

  @Prop({ type: Boolean , default: false })
  isUpdateTog: Boolean;
}

export const CgInventorySchema = SchemaFactory.createForClass(CgInventory);