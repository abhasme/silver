import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

export type SilverCategoryDocument = SilverCategory & Document;

@Schema()
export class SilverCategory {

    @Prop({ type: String , required : true , trim: true, index: true, unique: true, sparse: true})
    categoryName: string;

    @Prop({ type: Number , required : true , trim: true, index: true, unique: true, sparse: true})
    categoryCode: number;

    @Prop({ type: Date,default: new Date() })
    createdAt: Date;

    @Prop({ type: Boolean , default: true })
    active: Boolean;
}

export const SilverCategorySchema = SchemaFactory.createForClass(SilverCategory);