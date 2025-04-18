import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { PermissionRole } from '../common/enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true , index: true})
  firstName: string;

  @Prop({ type: String, required: true , index: true})
  lastName: string;

  @Prop({ type: String})
  firmName: string;

  @Prop({ type: String , trim: true, index: true, unique: true, sparse: true})
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String})
  viewPassword: string;

  @Prop([{type: SchemaTypes.ObjectId, ref: 'Unit' , index: true}])
  units: Types.ObjectId;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' , index: true})
  createdBy: Types.ObjectId;

  @Prop({ type: Boolean , default: true })
  active: Boolean;

 
  //=======================Silver========================//

    @Prop({ type: Boolean , default: false })
    isAcceptingProduction: Boolean;
  
    @Prop({ type: Boolean , default: false })
    isReplenishmentRecommendations: Boolean;

    @Prop({ type: Boolean , default: false })
    isHandlingWip : Boolean;

    @Prop({ type: Boolean , default: false })
    isDispatching : Boolean;


    @Prop({ type: Boolean , default: false })
    isHoViewCgOrder : Boolean;

    @Prop({ type: Boolean , default: false })
    isHoViewCgInventory : Boolean;

    @Prop({ type: Boolean , default: false })
    isHoViewCgConsumption : Boolean;

    @Prop({ type: Boolean , default: false })
    isHoViewROOrder : Boolean;

    @Prop({ type: Boolean , default: false })
    isHoViewRoInventory : Boolean;

    @Prop({ type: Boolean , default: false })
    isHoViewRoConsumption : Boolean;

    @Prop({ type: Boolean , default: false })
    isHoViewSilverProduct : Boolean;
  

    @Prop({ type: Boolean , default: false })
    isHoViewRoMaster : Boolean;
  
  //=======================Silver========================//

    @Prop({ type: Boolean , default: false })
    isUpdateAccessRo : Boolean;


  @Prop({ required: true, enum: PermissionRole }) // Use the enum for the field
  userType: PermissionRole;


  @Prop({ type: SchemaTypes.ObjectId, ref: 'romasters' , index: true})
  roId: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);