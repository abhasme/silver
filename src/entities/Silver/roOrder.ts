
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Permissionstatus } from '../../common/enums/role.enum';
// import * as autoIncrement from 'mongoose-auto-increment';

export type RoOrderDocument = RoOrder & Document;


@Schema()
export class RoOrder {

  @Prop({ type: SchemaTypes.ObjectId, ref: 'romasters', index: true })
  roId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'roproducts', index: true })
  productId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'roinventories', index: true })
  inventoryId: Types.ObjectId;

  @Prop({ type: Number, index: true, default: 0 })
  qty: number;


  @Prop({ type: String,index: true, default: ""})
  uniqueOrderKey: string;

  @Prop({ type: String,index: true, default: ""})
  plant: string;

  @Prop({ required: true, enum: Permissionstatus, default: Permissionstatus })
  status: Permissionstatus;

  @Prop({ type: Number , index: true,default: 0})
  tog: number;

  @Prop({ type: Number , index: true,default: 0})
  onHandStock: number;

  @Prop({ type: Number , index: true,default: 0})
  openOrder: number;

  @Prop({ type: Number , index: true,default: 0})
  qualifiedDemand: number;

  @Prop({ type: Number , index: true,default: 0})
  netFlow: number;

  @Prop({ type: Number, index: true, default:1})
  uniqueNumber: number;

  @Prop({ type: Number, index: true, default:1})
  partialUniqueNumber: number;

  @Prop({
    type: Object,
    default: {
      status: true,
      stage: "RECOMMENDATION",
      createdAt: new Date(),
      qty: 0,
    },
  })
  recommendation: {
    status: boolean;
    stage: string;
    createdAt: Date;
    qty: number;
  };

  @Prop({
    type: Object,
    default: {
      status: true,
      stage: "PENDING",
      createdAt: new Date(),
      qty: 0,
    },
  })
  cg: {
    status: boolean;
    stage: string;
    createdAt: Date;
    qty: number;
  };

  @Prop({
    type: Object,
    default: {
      status: false,
      stage: "PENDING",
      createdAt: new Date(),
      qty: 0,
      isChangeQty:false,
      isPartialDispatch:false,
      partialDispatchQty:0
    },
  })
  wip: {
    status: boolean;
    stage: string;
    createdAt: Date;
    qty: number;
    isChangeQty:boolean;
    isPartialDispatch:boolean;
    partialDispatchQty:number;
  };

  @Prop({
    type: Object,
    default: {
      status: false,
      stage: "PENDING",
      createdAt: new Date(),
      qty: 0,
      isPartialDispatch:false,
      partialDispatchQty:0,
    },
  })
  in_trasit: {
    status: boolean;
    stage: string;
    createdAt: Date;
    qty: number;
    isPartialDispatch:boolean;
  };

  @Prop({
    type: Object,
    default: {
      status: false,
      stage: "PENDING",
      createdAt: new Date(),
      qty: 0,
    },
  })
  grn: {
    status: boolean;
    stage: string;
    createdAt: Date;
    qty: number,
  };

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', index: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: Boolean, default: false })
  isInTransit: boolean;

  @Prop({ type: Boolean, default: true })
  isWip: boolean;
}


export const RoOrderSchema = SchemaFactory.createForClass(RoOrder);
