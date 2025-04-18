import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type RoMasterDocument = RoMaster & Document;

@Schema()
export class RoMaster {

  @Prop({ type: String, required: true })
  roName: string;

  @Prop({ type: String , index: true})
  contactPersonName: string;

  @Prop({ type: String})
  phone: string;

  @Prop({ type: String , trim: true})
  email: string;

  @Prop({ type: String , index: true})
  address: string;

  @Prop({ type: String , index: true})
  city: string;

  @Prop({ type: String , index: true})
  state: string;

  @Prop({ type: Number , index: true,default: 0})
  leadTime: number;

  @Prop({ type: Number , index: true,default: 0})
  stockUpWeeks: number;

  @Prop({ type: String , index: true})
  growthFactor: string;

  @Prop({ type: Date,default: new Date() })
  createdAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' , index: true})
  createdBy: Types.ObjectId;

  @Prop({ type: Boolean , default: true })
  isActive: Boolean;
}

export const RoMasterSchema = SchemaFactory.createForClass(RoMaster);